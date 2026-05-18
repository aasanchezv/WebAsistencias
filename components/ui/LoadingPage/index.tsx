import Spinner from '../Spinner';
import styles from './loadingpage.module.css';

type LoadingPageProps = {
  primaryColor?: string;
  secondaryColor?: string;
};

export default function LoadingPage({
  primaryColor = "ffffff",
  secondaryColor = "000000",
}: LoadingPageProps) {
  return (
    <div className={styles.container}>
      <Spinner
        size={30}
        border={3}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
      />
    </div>
  );
}