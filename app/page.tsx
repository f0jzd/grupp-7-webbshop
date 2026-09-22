export default async function ProductPage() {
  return(
    <article className="flex flex-col items-center justify-center">
      <p>this is a primary product catalog</p>
      <input defaultValue="test"></input>
      <section>
        <h1>This should be the main shop grid:</h1>
        <div>
        {
          // dummy element generation loop
          [...Array(5)].map((_, i) => (
          <div key={i} className="
          border border-red-400
          h-35 w-40
          ">
            Dummy card {i + 1}</div>
          ))
        }
        </div>
      </section>

    </article>
    )
}
