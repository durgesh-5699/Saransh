import BgGradient from "@/components/common/bg-gradient";
import PricingSection from "@/components/home/pricing-section";

export default function PricingPage() {
    return (
        <div className="relative w-full">
            <BgGradient />
            <div className="flex flex-col">
                <PricingSection/>
            </div>
        </div>
    );
}