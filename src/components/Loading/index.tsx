import styles from './loading.module.scss';

export default function Loading() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.ldsGrid}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <p>Carregando...</p>
      </div>
    </>
  );
}
