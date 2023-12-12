export default function Example() {
  return (
    <div className='bg-white'>
      <div className="px-20">
        <h3 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Few-shot classification example</h3>
      </div>
      <div className="mt-6 border-t border-gray-100 px-20">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-lg font-medium leading-8 text-gray-900">Feature name</dt>
            <dd className="mt-1 text-lg leading-8 text-gray-600 sm:col-span-2 sm:mt-0">Intellectual Humility</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-lg font-medium leading-8 text-gray-900">Definition</dt>
            <dd className="mt-1 text-lg leading-8 text-gray-600 sm:col-span-2 sm:mt-0">This category concerns the person recognizing limits of their knowledge. The writer acknowledges that they may not have sufficient knowledge about a particular situation or a person’s behavior to make a comprehensive judgment or response. The statement  mentions how additional information could influence their decision and/or change their opinion of the situation. The writer indicates in the statement that they may lack knowledge about the factors that led to the behavior of the individuals involved in the event behave in a particular way.</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-lg font-medium leading-8 text-gray-900">
              <p>Present example</p> 
              <p>Present explanation</p>
            </dt>
            <dd className="mt-1 text-lg leading-8 text-gray-600 sm:col-span-2 sm:mt-0">
              <p>
                I wonder if there’s something more going on than what I’ve been told.
              </p>
              <p>
                States that they acknowledge a potential gap in their understanding.
              </p>
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-lg font-medium leading-8 text-gray-900">
              <p>Absent example</p> 
              <p>Absent explanation</p>
            </dt>
            <dd className="mt-1 text-lg leading-8 text-gray-600 sm:col-span-2 sm:mt-0">
              <p>
                I'm sure I understand the whole situation perfectly.
              </p>
              <p>
              Mentions understanding of the situation, but does not acknowledge potential gaps or a need for more information.
              </p>
            </dd>
          </div>

        </dl>
      </div>
    </div>
  )
}
