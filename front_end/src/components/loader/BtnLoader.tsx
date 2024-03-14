import styles from "./styles.module.css";
const BtnsLoaderSpinner = () => {
	return (
		<div className={styles.btn_loading_ring_wrapper}>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
	);
};
export default BtnsLoaderSpinner;
