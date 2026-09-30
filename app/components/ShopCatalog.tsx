
// custom/inhouse
import GridCard from "./ProductGridCard";
import type { Product } from "@/types";

import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from "./ui/empty";


export default function ShopCatalog({className, data}:{className:string, data:Product[]}){
    if (data.length === 0) {
      return (
        <Empty className={className}>
          <EmptyHeader>
            <EmptyTitle>No products found</EmptyTitle>
            <EmptyDescription>
              Try a different search, or reset the category filter.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      );
    }

    return(
          <div className={className}>
          {
            data.map((product:Product) => (
              <GridCard key={product.id} product={product} />
            ))
          }</div>
    )
}