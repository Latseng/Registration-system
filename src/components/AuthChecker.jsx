import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { setLogout } from "../store/authSlice";

const AuthChecker = ({ children }) => {
  const { isAuthenticated, expiresAt } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated && expiresAt) {
      const now = Date.now();
      const timeLeft = expiresAt - now;

      if (timeLeft <= 0) {
        //超過時效則登出
        dispatch(setLogout());
      } else {
        const timer = setTimeout(() => {
          dispatch(setLogout());
        }, timeLeft);

        // 清除定時器避免內存洩漏
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, expiresAt, dispatch]);

  return children;
};

export default AuthChecker;
