import { GetStaticPaths, GetStaticProps } from 'next';
import Head from "next/head";
import { useRouter } from 'next/router';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom';

import { getPrismicClient } from '../../services/prismic';
import { calcTimeToRead, formatDateTo_dd_MMM_Y } from '../utils/utils';

import Header from '../../components/Header';
import Loading from '../../components/Loading';

import styles from './post.module.scss';
interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {

  const router = useRouter();

  // Verifica se está processando e mostra a mensagem de carregando
  if (router.isFallback) {
    return <Loading/>;
  }
  
  const getAllWordFromPostContent = () => {

    const allWords = post.data.content.map(content => (
      content.heading + RichText.asText(content.body)
    ))

    return allWords.join(' ');
  }

  return (
    <>
      <Header/>

      <Head>
        <title>{`${post.data.title} | SpaceTraveling`}</title>
      </Head>

      <section className={styles.container}>
        <article>
          <div className={styles.banner}>
            <img src={post.data.banner.url} alt="" />
          </div>
          <div className={styles.content}>
            <h1>{post.data.title}</h1>
            <div className={styles.postInfos}>
              <div className={styles.postDate}>
                <FiCalendar size={20}/>
                <p>{formatDateTo_dd_MMM_Y(post.first_publication_date)}</p>
              </div>
              <div className={styles.postAuthor}>
                <FiUser size={20}/>
                <p>{post.data.author}</p>
              </div>
              <div className={styles.postTimeToRead}>
                <FiClock size={20}/>
                <p>{`${calcTimeToRead(getAllWordFromPostContent())} min`}</p>
              </div>
            </div>
            <div className={styles.postBody}>
              {post.data.content.map((content, index) => (
                <div key={index}>
                  <h3>
                    {content.heading}
                  </h3>
                  <div dangerouslySetInnerHTML={{__html: RichText.asHtml(content.body)}}></div>
                </div>
              ))}
            </div>
          </div>
        </article>
      
      </section>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      fetch: [
        'post.title',
        'post.subtitle',
        'post.author',
        'post.banner',
        'post.content',
      ],
    }
  );

  const paths = posts.results.map(post => ({
    params: { slug: post.uid },
  }));

  return { 
    paths, 
    fallback: false 
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  const post = { ...response };
  
  return {
    props: {
      post: {
        first_publication_date: post.first_publication_date,
        uid: post.uid,
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          banner: {
            url: post.data.banner.url,
          },
          author: post.data.author,
          content: post.data.content,
        }
      }
    }
  };
};