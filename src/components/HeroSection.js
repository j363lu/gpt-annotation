export default function LandingPage() {

  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:pb-100 lg:pt-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              AI Coder
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              AI Coder is a tool for recognizing and coding complex psychological content such as limits of knowledge, perspective-taking or empathy, or willingness to compromise. It uses OpenAI's GPT-3.5-turbo and GPT-4-turbo models for feature identification (presence or absence) in text based on pre-defined instructions.
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              You may optionally provide a few examples to the large language models to let them perform few-shot classification to improve the accuracy of the results. In that case, you will need to provide a few examples and explanations.
            </p>

            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#gui"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get started
              </a>
              <a href="https://osf.io/preprints/psyarxiv/x2f4a" target="_blank" rel="noreferrer" className="text-sm font-semibold leading-6 text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
