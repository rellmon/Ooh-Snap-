import Button from '../components/ui/Button'

function NotFound() {
  return (
    <section className="flex flex-col items-center overflow-x-clip px-6 py-20 text-center">
      <div className="relative">
        <div
          aria-hidden="true"
          className="dots absolute -left-10 -top-6 h-20 w-20"
        />
        <p className="relative -rotate-3 border-4 border-ink bg-sun px-8 py-2 font-heading text-[8rem] leading-none shadow-hard-lg sm:text-[11rem]">
          404
        </p>
      </div>

      <h1 className="mt-12 max-w-xl text-5xl leading-none sm:text-6xl">
        Oops, this shot is out of frame.
      </h1>
      <p className="mt-4 text-lg">
        We couldn't find the page you were looking for.
      </p>

      <div aria-hidden="true" className="checker my-8 h-4 w-32" />

      <Button to="/" size="lg">
        Back to home
      </Button>
    </section>
  )
}

export default NotFound