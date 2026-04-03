import { redirect } from 'next/navigation';

export default function Home() {
    // Middleware handles redirection to /login if unauthenticated,
    // or /dashboard if authenticated. Since edge middleware cannot
    // decode our JWT (without external libs like jose), we just
    // redirect / to /login. If they are already logged in, they can
    // sign in again and be routed.

    redirect('/login');
}
