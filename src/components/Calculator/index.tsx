import { useEffect, useRef, useState } from "react";
import { generateRandomString, shuffle } from "../../utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ButtonWrapper } from "./ButtonWrapper";

const OPERATIONS = ["÷", "x", "-", "+", "="];
const NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const BUTTON_MAPPER: {
	[key: string]: string;
} = {
	x: "*",
	"÷": "/",
};

const Calculator = () => {
	const [display, setDisplay] = useState("");
	const [memory, setMemory] = useState("");
	const [operation, setOperation] = useState("");
	const [flag, setFlag] = useState(false);
	const [history, setHistory] = useState<
		{
			expression: string;
			value: string;
		}[]
	>([]);
	const [buttons, setButtons] = useState<string[][]>([]);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleBlur = () => {
		setTimeout(() => {
			inputRef.current?.focus();
		}, 0);
	};

	const keyPressHandler = (key: string) => {
		let input = key;

		if (["x", "÷"].includes(key)) {
			input = BUTTON_MAPPER[key];
		}

		if ([...OPERATIONS, "/", "*"].includes(input)) {
			if (!flag) {
				setMemory(display || "0");
			}

			if (memory && operation && display) {
				const expression = flag
					? `${display} ${operation} ${memory}`
					: `${memory} ${operation} ${display}`;
				const value = display ? eval(expression) : 0;
				setHistory((curr) => [
					{
						expression,
						value,
					},
					...curr,
				]);
				setDisplay(value);
			}
			setOperation(input === "=" ? "" : input);
			setFlag(input !== "=");
		} else {
			if (input === ".") {
				setDisplay((curr) =>
					flag || curr === "" ? "0." : curr.includes(".") ? curr : curr + input
				);
				setFlag(false);
			} else if (input === "Escape" || input === "CE") {
				setDisplay("");
				setMemory("");
				setOperation("");
				setFlag(false);
			} else if (input === "Backspace") {
				if (!flag) {
					setDisplay((curr) => curr.slice(0, -1));
				}
			} else if (NUMBERS.includes(input)) {
				if (flag) {
					setMemory(display);
				}
				setDisplay((curr) => (flag ? input : curr + input));
				setFlag(false);
			}
		}
	};

	useEffect(() => {
		let cleanup = false;
		if (!cleanup) {
			const numbers = [...shuffle(NUMBERS), "."];
			const arr: string[][] = [];
			let count = 0;
			for (let i = 0; i < 5; i++) {
				if (i === 0) {
					arr.push(["CE", OPERATIONS[i]]);
				} else {
					let temp = numbers.slice(count, 3 + count);

					arr.push([...temp, OPERATIONS[i]]);
					count = count + 3;
				}
			}
			setButtons(arr);
		}

		return () => {
			cleanup = true;
		};
	}, []);

	return (
		<div className="flex flex-col md:flex-row gap-5">
			<section className="flex flex-col space-y-3">
				<div>
					<Input
						ref={inputRef}
						autoFocus
						readOnly
						placeholder="0"
						type="text"
						className="text-right"
						value={display}
						onBlur={handleBlur}
						onKeyDown={({ key }) => keyPressHandler(key)}
					/>
				</div>
				<div className="grid grid-cols-4 grid-rows-5 gap-3 items-center">
					{buttons.map((row, index, arr) => {
						if (index === 0) {
							return row.map((value, val_index) => {
								return !val_index ? (
									<ButtonWrapper key={generateRandomString(10)}>
										<Button
											onClick={() => keyPressHandler(value)}
											variant="default"
										>
											{value}
										</Button>
									</ButtonWrapper>
								) : (
									<ButtonWrapper
										key={generateRandomString(10)}
										className="col-start-4"
									>
										<Button
											onClick={() => keyPressHandler(value)}
											variant="default"
										>
											{value}
										</Button>
									</ButtonWrapper>
								);
							});
						} else if (index === arr.length - 1) {
							return row.map((value, val_index) => {
								return !val_index ? (
									<ButtonWrapper
										key={generateRandomString(10)}
										className="col-start-2"
									>
										<Button
											onClick={() => keyPressHandler(value)}
											variant="secondary"
										>
											{value}
										</Button>
									</ButtonWrapper>
								) : (
									<ButtonWrapper key={generateRandomString(10)}>
										<Button
											onClick={() => keyPressHandler(value)}
											variant={
												OPERATIONS.includes(value) ? "default" : "secondary"
											}
										>
											{value}
										</Button>
									</ButtonWrapper>
								);
							});
						} else {
							return row.map((value) => {
								return (
									<ButtonWrapper key={generateRandomString(10)}>
										<Button
											onClick={() => keyPressHandler(value)}
											variant={
												OPERATIONS.includes(value) ? "default" : "secondary"
											}
										>
											{value}
										</Button>
									</ButtonWrapper>
								);
							});
						}
					})}
				</div>
			</section>
			<section className="w-[250px] max-h-[296px] overflow-y-auto space-y-3 px-3">
				<div className="text-xl">History</div>
				<div className="flex flex-col gap-3">
					{history.length ? (
						history.map((i) => (
							<div key={generateRandomString(10)} className="text-right">
								<div className="text-sm">{i.expression} =</div>
								<div className="text-lg font-medium">{i.value}</div>
							</div>
						))
					) : (
						<div>There's no history yet.</div>
					)}
				</div>
			</section>
		</div>
	);
};

export default Calculator;
