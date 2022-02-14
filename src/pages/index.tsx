import { useState } from 'react';
import { GetStaticProps } from 'next';
import { FiCalendar, FiUser } from 'react-icons/fi';
import Head from "next/head";
import Link from 'next/link'
import Prismic from '@prismicio/client'

import { getPrismicClient } from '../services/prismic';

import Header from '../components/Header';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { formatDateTo_dd_MMM_Y } from '../utils/utils';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  
  const [posts, setPosts] = useState(postsPagination.results);
  const [urlToNextPage, setUrlToNextPage] = useState(postsPagination.next_page);

  async function handleLoadMorePosts() {
    const response = await fetch(urlToNextPage);
    const data = await response.json();

    const { results } = data;
    setPosts([...posts, ...results]);

    const { next_page } = data;
    setUrlToNextPage(next_page);
  }
  
  return (
    <>
    
      <Header/>

      <Head>
        <title>Home | SpaceTraveling</title>
      </Head>

      <main className={commonStyles.siteContainer}>
        <section className={styles.content}>
          {posts.map(post => (
            <Link href={`/post/${post.uid}`} key={post.uid} >
              <a>
                <h1>{post.data.title}</h1>
                <p className={styles.postSubtitle}>{post.data.subtitle}</p>
                <div className={styles.postInfos}>
                  <div className={styles.postDate}>
                    <FiCalendar size={18}/>
                    <p>{formatDateTo_dd_MMM_Y(post.first_publication_date)}</p>
                  </div>
                  <div className={styles.postAuthor}>
                    <FiUser size={18}/>
                    <p>{post.data.author}</p>
                  </div>
                </div>
              </a>
            </Link>
          ))}
          
          {urlToNextPage && (
            <button type="button" onClick={handleLoadMorePosts}>
              Carregar mais posts
            </button>
          )}
      
        </section>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query([
    Prismic.predicates.at('document.type', 'posts')
  ], {
    fetch: [ 'post.title', 'post.subtitle', 'post.author', 'post.banner', 'post.content'],
    pageSize: 3,
  });
  
  const results = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      }
    }
  })
  
  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results
      }
    }
  }

};