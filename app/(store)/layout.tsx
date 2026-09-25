import { CheckoutProvider } from "@/components/checkout/checkout-provider";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export default function StoreLayout({ children }: LayoutProps<"/">) {
  return (
    <CheckoutProvider>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </CheckoutProvider>
  );
}
