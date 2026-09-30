
// custom/inhouse
import GridCard from "./ProductGridCard";
import type { Product } from "@/types";


export default function ShopCatalog({className, data}:{className:string, data:Product[]}){
    return(
        <section className="flex-col w-full">
            {/* Old ver of grid: */}
            {/* <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] *:w-full"> */}
            <div className={className}>
            {
              data.map((product:Product) => (
                <GridCard key={product.id} product={product} />
              ))
            }</div>
          </section>
    )
}