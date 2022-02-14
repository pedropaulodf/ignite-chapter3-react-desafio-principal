import Link from 'next/link'
import commonStyles from '../../styles/common.module.scss';
import styles from './header.module.scss';

export default function Header() {
  
  return (
    <>
      <header className={commonStyles.siteContainer}>
        <div className={styles.headerContent}>
          <Link href="/" >
            <a>
              <img src="/Logo.svg" alt="Logo" />
            </a>
          </Link>
          
        </div>
      </header>
    </>
  )
}
