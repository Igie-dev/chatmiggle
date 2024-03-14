import styles from "./styles.module.css";
const LoaderSpinner = () => {
	return (
		<section className={styles.loader_ring_container}>
			<div className={styles.loading_ring_wrapper}>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</section>
	);
};

export default LoaderSpinner;
