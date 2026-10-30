/**
 * Phase 3: reusable authorization wrapper.
 * Children appear only when the logged-in user has the capability requested.
 * NOTE: hiding buttons is not security; the Express API checks permissions too.
 */
import { useContext } from 'react';
import { AuthContext } from '../../Context/Auth/Auth';

export default function Auth({ capability, children, fallback = null }) {
  const { isLoggedIn, can } = useContext(AuthContext);
  return isLoggedIn && can(capability) ? children : fallback;
}
