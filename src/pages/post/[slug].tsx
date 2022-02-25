import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';

import { getPrismicClient } from '../../services/prismic';
import {
  calcTimeToRead,
  formatDateTo_dd_MMM_Y,
  formatDateTo_dd_MMM_Y_HH_mm,
} from '../../utils/utils';

import Header from '../../components/Header';
import Loading from '../../components/Loading';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { CommentsSection } from '../../components/CommentsSection';
interface Post {
  last_publication_date: string | null;
  first_publication_date: string | null;
  prev_post: any,
  next_post: any
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
  preview: any;
}

export default function Post({ post, preview }: PostProps) {
  const router = useRouter();

  // Verifica se está processando e mostra a mensagem de carregando
  if (router.isFallback) {
    return <Loading />;
  }

  const getAllWordFromPostContent = () => {
    const allWords = post.data.content.map(
      content => content.heading + RichText.asText(content.body)
    );

    return allWords.join(' ');
  };
  
  return (
    <>
      <Header />

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
                <FiCalendar size={20} />
                <p>{post.first_publication_date}</p>
              </div>
              <div className={styles.postAuthor}>
                <FiUser size={20} />
                <p>{post.data.author}</p>
              </div>
              <div className={styles.postTimeToRead}>
                <FiClock size={20} />
                <p>{`${calcTimeToRead(getAllWordFromPostContent())} min`}</p>
              </div>
            </div>
            <div className={styles.postInfosEdited}>
              <div className={styles.postDate}>
                <p>{`* editado em ${post.last_publication_date}`}</p>
              </div>
            </div>
            <div className={styles.postBody}>
              {post.data.content.map((content, index) => (
                <div key={index}>
                  <h3>{content.heading}</h3>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: RichText.asHtml(content.body),
                    }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>

      <div className={commonStyles.siteContainer}>

        <hr className={commonStyles.divider} />

        <section className={styles.bottomPostActions}>
          {post.prev_post !== 'undefined' && (
            <Link href={`/post/${post.prev_post.uid}`}>
              <a>
                <h3>{post.prev_post.data.title}</h3>
                <p>Post anterior</p>
              </a>
            </Link>
          )}

          <div className={styles.verticalDivider} />

          {post.next_post !== 'undefined' && (
            <Link href={`/post/${post.next_post.uid}`}>
              <a>
                <h3>{post.next_post.data.title}</h3>
                <p>Próximo post</p>
              </a>
            </Link>
          )}
        </section>

        <CommentsSection />

        {preview && (
          <aside className={commonStyles.btnExitPreview}>
            <Link href="/api/exit-preview">
              <a>Sair do modo Preview</a>
            </Link>
          </aside>
        )}
      </div>
    </>
  );
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
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
  previewData,
}) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), { ref: previewData?.ref ?? null });

  const post = { ...response };
  
  const prevpost = (await prismic.query([Prismic.Predicates.at('document.type', 'posts')], { 
    pageSize : 1 , after : `${post.id}`, 
    orderings: '[document.first_publication_date]'
  })).results[0] || 'undefined';

  const nextpost = (await prismic.query([Prismic.Predicates.at('document.type', 'posts')], { 
    pageSize : 1 , after : `${post.id}`, 
    orderings: '[document.first_publication_date desc]',
  })).results[0] || 'undefined';

  return {
    props: {
      post: {
        last_publication_date: formatDateTo_dd_MMM_Y_HH_mm(
          post.last_publication_date
        ),
        first_publication_date: formatDateTo_dd_MMM_Y(
          post.first_publication_date
        ),
        uid: post.uid,
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          banner: {
            url: post.data.banner.url,
          },
          author: post.data.author,
          content: post.data.content,
        },
        prev_post: prevpost,
        next_post: nextpost
      },
      preview,
    },
  };
};
