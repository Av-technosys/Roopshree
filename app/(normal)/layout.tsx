import { Suspense } from "react"

import Footer from "@/components/common/Footer"
import Header from "@/components/common/Header"
import { StoreHydrator } from "@/components/global/StoreHydrator"
import { getCurrentSession } from "@/lib/auth"


export default async function Layout({ children }: {
    children: React.ReactNode
}) {
   const session = await getCurrentSession()
   

    return <>
      <StoreHydrator isAuthenticated={Boolean(session)} />
      <Suspense>
        <Header isAuthenticated={Boolean(session)} />
      </Suspense>
        {children}
       <Footer />
    </>
}
