import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-7xl font-extrabold text-pink-600">404</p>
      <h1 className="mt-4 text-3xl font-bold">Oops, this shot is out of frame.</h1>
      <p className="mt-2 text-slate-600">
        We couldn't find the page you were looking for.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-full bg-pink-600 px-6 py-3 font-semibold text-white hover:bg-pink-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-600"
      >
        Back to home
      </Link>
    </section>
  )
}

export default NotFound