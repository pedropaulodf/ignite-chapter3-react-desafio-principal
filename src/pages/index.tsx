import { GetStaticProps } from 'next';
import Header from '../components/Header';
import Link from 'next/link'

import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client'

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { FiCalendar, FiUser } from 'react-icons/fi';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

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
  // TODO
  const { results, next_page } = postsPagination;

  return (
    <>
    
      <Header/>

      <main className={commonStyles.siteContainer}>
        <section className={styles.content}>
          {results.map(post => (
            <Link key={post.uid} href={`/post/${post.uid}`}>
              <a>
                <h1>{post.data.title}</h1>
                <p className={styles.postSubtitle}>{post.data.subtitle}</p>
                <div className={styles.postInfos}>
                  <div className={styles.postDate}>
                    <FiCalendar size={18}/>
                    <p>{post.first_publication_date}</p>
                  </div>
                  <div className={styles.postAuthor}>
                    <FiUser size={18}/>
                    <p>{post.data.author}</p>
                  </div>
                </div>
              </a>
            </Link>
          ))}
          <button onClick={() => console.log('Carregar mais posts')}>Carregar mais posts</button>
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
    fetch: ['posts.title', 'posts.subtitle', 'posts.author', 'posts.content'],
    pageSize: 20,
  });

  const results = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(
        new Date(post.first_publication_date),
        "dd MMM Y",
        {
          locale: ptBR,
        }
      ),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      }
    }
  })
  
  const next_page = '';

  return {
    props: {
      postsPagination: {
        next_page,
        results
      }
    }
  }

};