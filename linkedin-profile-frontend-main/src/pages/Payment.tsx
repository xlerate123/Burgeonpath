import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Smartphone,
  Shield,
  CheckCircle,
  ArrowLeft,
  Star,
  Users,
  BookOpen,
  Zap
} from "lucide-react";
import Navigation from "@/components/Navigation";

const Payment = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };
  // 🧾 Razorpay payment logic
  const handlePayment = async () => {
    try {
      setIsProcessing(true);

      // 1️⃣ Create order from backend
      const orderResponse = await fetch(`${process.env.VITE_API_URL}/api/v1/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 999 }), // amount in INR
        credentials: "include",
      });

      const { order } = await orderResponse.json();

      if (!order || !order.id) {
        throw new Error("Order creation failed");
      }

      // 2️⃣ Load Razorpay script dynamically
      const res = await loadRazorpay();
      if (!res) {
        alert("Razorpay SDK failed to load. Check your internet connection.");
        setIsProcessing(false);
        return;
      }

      // 3️⃣ Open Razorpay checkout popup
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // your test key
        amount: order.amount,
        currency: order.currency,
        name: "Burgeonpath",
        description: "LinkedIn Optimization Bundle",
        order_id: order.id,
        handler: async function (response) {
          // 4️⃣ Verify payment in backend
          const verifyRes = await fetch(`${process.env.VITE_API_URL}/api/v1/payment/verify-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
            credentials: "include",
          });

          const result = await verifyRes.json();

          if (result.success) {
            alert("Payment Successful! 🎉");
            navigate("/educational-content");
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#6C63FF",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setIsProcessing(false);
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong during payment. Try again.");
      setIsProcessing(false);
    }
  };

  // 🔹 Utility to dynamically load Razorpay script
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const features = [
    { icon: <Zap className="w-5 h-5" />, title: "AI Profile Analysis", description: "Get your LinkedIn profile scored and analyzed by AI" },
    { icon: <BookOpen className="w-5 h-5" />, title: "Educational Content", description: "Access 5+ videos and eBooks on LinkedIn optimization" },
    { icon: <Users className="w-5 h-5" />, title: "Community Access", description: "Join filtered Burgeonpath spaces based on your interests" },
    { icon: <Star className="w-5 h-5" />, title: "Personalized Reports", description: "Download detailed improvement suggestions" },
  ];

  return (
    
    <motion.div
      className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
          {/* Left: Features */}
          <motion.div className="space-y-6" variants={cardVariants} initial="hidden" animate="visible">
            <div className="text-center md:text-left">
              <motion.h1
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Unlock Your LinkedIn Potential
              </motion.h1>
              <motion.p
                className="text-lg text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Get AI-powered insights and personalized recommendations to optimize your professional profile.
              </motion.p>
            </div>

            <div className="space-y-4">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border"
                >
                  <motion.div
                    className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center text-white flex-shrink-0"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Shield className="w-4 h-4" />
              <span>Secure payment powered by Razorpay</span>
            </motion.div>
          </motion.div>

          {/* Right: Payment */}
          <motion.div variants={cardVariants} initial="hidden" animate="visible">
            <Card className="bg-background/80 backdrop-blur-sm border-border shadow-soft">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Complete Your Purchase</CardTitle>
                <CardDescription>One-time payment for lifetime access to all features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Pricing */}
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl font-bold text-foreground">₹999</span>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      Limited Time
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="line-through">₹2,499</span> - Save ₹1,500
                  </p>
                </div>

                {/* Payment Method Buttons */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Choose Payment Method</h3>
                  <div className="space-y-3">
                    <motion.button
                      className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-all ${
                        paymentMethod === "card"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setPaymentMethod("card")}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <CreditCard className="w-5 h-5" />
                      <div className="text-left">
                        <div className="font-medium">Credit/Debit Card</div>
                        <div className="text-sm text-muted-foreground">Visa, Mastercard, RuPay</div>
                      </div>
                    </motion.button>

                    <motion.button
                      className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-all ${
                        paymentMethod === "upi"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setPaymentMethod("upi")}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Smartphone className="w-5 h-5" />
                      <div className="text-left">
                        <div className="font-medium">UPI Payment</div>
                        <div className="text-sm text-muted-foreground">Google Pay, PhonePe, Paytm</div>
                      </div>
                    </motion.button>
                  </div>
                </div>

                {/* Payment Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full bg-gradient-primary hover:shadow-glow text-lg py-6"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <motion.div
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Processing Payment...
                      </div>
                    ) : (
                      `Pay ₹999 with ${paymentMethod === "card" ? "Card" : "UPI"}`
                    )}
                  </Button>
                </motion.div>

                {/* Trust Badges */}
                <div className="space-y-3 text-center">
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span>SSL Secured</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span>Instant Access</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span>Money Back</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    30-day money-back guarantee if you're not satisfied
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Payment;
