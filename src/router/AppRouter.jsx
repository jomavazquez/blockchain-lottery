import { Route, Routes } from "react-router-dom";
import { Tokens, Lottery, Winner, Footer } from "../components";

export const AppRouter = () => {
	return (
		<>
			<div className="App">
				<Routes>
					<Route path="/" element={ <Tokens /> } />
					<Route path="/lottery" element={ <Lottery /> } />
					<Route path="/winner" element={ <Winner /> } />
				</Routes>
				<Footer />
			</div>
		</>
  )
}