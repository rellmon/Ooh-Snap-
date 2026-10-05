import Button from '../components/ui/Button'

function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center px-6 py-24 text-center">
      <p className="font-display text-7xl font-bold text-pink-600">404</p>
      <h1 className="mt-4 text-3xl font-bold">Oops, this shot is out of frame.</h1>
      <p className="mt-2 text-slate-600">
        We couldn't find the page you were looking for.
      </p>
      <Button to="/" className="mt-8">
        Back to home
      </Button>
    </section>
  )
}

export default NotFound