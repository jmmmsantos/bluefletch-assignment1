export const ButtonWrapper = (
	props: React.DetailedHTMLProps<
		React.HTMLAttributes<HTMLDivElement>,
		HTMLDivElement
	>
) => {
	return (
		<div
			{...props}
			className={`${
				props.className ? `${props.className} ` : ""
			} flex justify-center`}
		>
			{props.children}
		</div>
	);
};
