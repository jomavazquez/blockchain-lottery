import { WebProvider } from "./context/WebProvider";
import { AppRouter } from "./router/AppRouter";

export const LotteryApp = () => {
  return (
	<>
		<WebProvider>
			<AppRouter />
		</WebProvider>
	</>
  )
}