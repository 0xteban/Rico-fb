"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ChevronRight,
  BarChart3,
  PiggyBank,
  CreditCard,
  Calendar,
  TrendingUp,
  Users,
  Settings,
  Sun,
  Moon,
  Plus,
  Minus,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { LoginModal } from "./login-modal"
import { SignupModal } from "./signup-modal"
import { useRouter } from "next/navigation"

// Sample features for the feature section
const features = [
  {
    title: { en: "Expense Tracking", es: "Seguimiento de Gastos" },
    description: {
      en: "Automatically categorize and track all your expenses in one place.",
      es: "Categoriza y rastrea automáticamente todos tus gastos en un solo lugar.",
    },
    icon: <CreditCard className="h-10 w-10 text-blue-500" />,
  },
  {
    title: { en: "Budget Management", es: "Gestión de Presupuesto" },
    description: {
      en: "Set budgets for different categories and get alerts when you're close to limits.",
      es: "Establece presupuestos para diferentes categorías y recibe alertas cuando estés cerca de los límites.",
    },
    icon: <PiggyBank className="h-10 w-10 text-purple-500" />,
  },
  {
    title: { en: "Financial Insights", es: "Análisis Financiero" },
    description: {
      en: "Get personalized insights about your spending habits and saving opportunities.",
      es: "Obtén información personalizada sobre tus hábitos de gasto y oportunidades de ahorro.",
    },
    icon: <BarChart3 className="h-10 w-10 text-green-500" />,
  },
  {
    title: { en: "Recurring Expenses", es: "Gastos Recurrentes" },
    description: {
      en: "Track subscriptions and recurring bills to avoid surprises.",
      es: "Rastrea suscripciones y facturas recurrentes para evitar sorpresas.",
    },
    icon: <Calendar className="h-10 w-10 text-orange-500" />,
  },
  {
    title: { en: "Financial Goals", es: "Metas Financieras" },
    description: {
      en: "Set and track progress towards your financial goals.",
      es: "Establece y rastrea el progreso hacia tus metas financieras.",
    },
    icon: <TrendingUp className="h-10 w-10 text-red-500" />,
  },
  {
    title: { en: "Shared Accounts", es: "Cuentas Compartidas" },
    description: {
      en: "Collaborate on finances with family members or partners.",
      es: "Colabora en finanzas con familiares o parejas.",
    },
    icon: <Users className="h-10 w-10 text-indigo-500" />,
  },
]

// FAQ items
const faqItems = [
  {
    question: {
      en: "How does Rico help me manage my finances?",
      es: "¿Cómo me ayuda Rico a administrar mis finanzas?",
    },
    answer: {
      en: "Rico uses AI to analyze your spending patterns, categorize expenses, and provide personalized insights. It helps you track expenses, set budgets, and achieve financial goals with smart recommendations.",
      es: "Rico utiliza IA para analizar tus patrones de gasto, categorizar gastos y proporcionar información personalizada. Te ayuda a rastrear gastos, establecer presupuestos y alcanzar metas financieras con recomendaciones inteligentes.",
    },
  },
  {
    question: { en: "Is my financial data secure with Rico?", es: "¿Están seguros mis datos financieros con Rico?" },
    answer: {
      en: "Yes, Rico takes security seriously. We use bank-level encryption to protect your data, and we never share your information with third parties without your explicit consent.",
      es: "Sí, Rico toma la seguridad en serio. Utilizamos cifrado de nivel bancario para proteger tus datos y nunca compartimos tu información con terceros sin tu consentimiento explícito.",
    },
  },
  {
    question: {
      en: "Can I share accounts with family members?",
      es: "¿Puedo compartir cuentas con miembros de mi familia?",
    },
    answer: {
      en: "Rico offers shared accounts that allow multiple users to collaborate on finances. It's perfect for couples, families, or roommates who want to manage shared expenses together.",
      es: "¡Absolutamente! Rico ofrece cuentas compartidas que permiten a múltiples usuarios colaborar en finanzas. Es perfecto para parejas, familias o compañeros de piso que quieren administrar gastos compartidos juntos.",
    },
  },
  {
    question: { en: "How much does Rico cost?", es: "¿Cuánto cuesta Rico?" },
    answer: {
      en: "Rico offers a free basic plan that includes essential features. For advanced features like custom insights, investment tracking, and unlimited shared accounts, we offer premium plans starting at $4.99/month.",
      es: "Rico ofrece un plan básico gratuito que incluye funciones esenciales. Para funciones avanzadas como análisis personalizados, seguimiento de inversiones y cuentas compartidas ilimitadas, ofrecemos planes premium desde $4.99/mes.",
    },
  },
  {
    question: { en: "Can Rico connect to my bank accounts?", es: "¿Puede Rico conectarse a mis cuentas bancarias?" },
    answer: {
      en: "Yes, Rico can securely connect to thousands of financial institutions worldwide. This allows for automatic transaction imports and real-time balance updates.",
      es: "Sí, Rico puede conectarse de forma segura a miles de instituciones financieras en todo el mundo. Esto permite importaciones automáticas de transacciones y actualizaciones de saldo en tiempo real.",
    },
  },
]

export default function LandingPage() {
  const { language, setLanguage, t } = useLanguage()
  const { user, isLoading } = useAuth()
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const router = useRouter()

  // Initialize theme from localStorage if available
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
    localStorage.setItem("theme", newTheme)
  }

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  // Redirect to chat if user is already logged in
  useEffect(() => {
    if (user && !isLoading) {
      router.push("/chat")
    }
  }, [user, isLoading, router])

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Rico
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Settings Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {/* Theme Toggle */}
                <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
                  <div className="flex items-center w-full">
                    {theme === "light" ? <Moon className="h-4 w-4 mr-2" /> : <Sun className="h-4 w-4 mr-2" />}
                    <span>{theme === "light" ? t("darkTheme") : t("lightTheme")}</span>
                  </div>
                </DropdownMenuItem>

                {/* Language Toggle */}
                <DropdownMenuItem onClick={() => setLanguage("en")} className="cursor-pointer">
                  <div className="flex items-center w-full">
                    <span className="mr-2">🇺🇸</span>
                    <span>English</span>
                    {language === "en" && <span className="ml-auto">✓</span>}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("es")} className="cursor-pointer">
                  <div className="flex items-center w-full">
                    <span className="mr-2">🇪🇸</span>
                    <span>Español</span>
                    {language === "es" && <span className="ml-auto">✓</span>}
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" onClick={() => setShowLoginModal(true)}>
              {language === "en" ? "Log In" : "Iniciar Sesión"}
            </Button>

            <Button
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              onClick={() => setShowSignupModal(true)}
            >
              {language === "en" ? "Sign Up" : "Registrarse"}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                {language === "en" ? (
                  <>
                    Your Personal{" "}
                    <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                      Financial Assistant
                    </span>
                  </>
                ) : (
                  <>
                    Tu{" "}
                    <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                      Asistente Financiero
                    </span>{" "}
                    Personal
                  </>
                )}
              </h1>
              <p className="text-xl text-muted-foreground">
                {language === "en"
                  ? "Rico helps you track expenses, manage budgets, and achieve your financial goals with AI-powered insights."
                  : "Rico te ayuda a rastrear gastos, administrar presupuestos y alcanzar tus metas financieras con análisis impulsados por IA."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  onClick={() => setShowSignupModal(true)}
                >
                  {language === "en" ? "Get Started Free" : "Comenzar Gratis"}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="group"
                  onClick={() => {
                    const featuresSection = document.getElementById("features")
                    if (featuresSection) {
                      featuresSection.scrollIntoView({ behavior: "smooth" })
                    }
                  }}
                >
                  {language === "en" ? "See Features" : "Ver Características"}
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src="/placeholder.svg?height=500&width=300"
                  alt="Rico App Screenshot"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl"></div>
              <div className="absolute -top-6 -right-6 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <p className="text-sm font-medium tracking-widest text-blue-500">
              {language === "en" ? "FEATURES" : "CARACTERÍSTICAS"}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">
              {language === "en"
                ? "Everything you need to manage your finances"
                : "Todo lo que necesitas para administrar tus finanzas"}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {language === "en"
                ? "Rico combines powerful financial tools with AI to give you complete control over your money."
                : "Rico combina potentes herramientas financieras con IA para darte control total sobre tu dinero."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border border-border hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title[language]}</h3>
                  <p className="text-muted-foreground">{feature.description[language]}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Example Outputs Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <p className="text-sm font-medium tracking-widest text-purple-500">
              {language === "en" ? "AI-POWERED" : "IMPULSADO POR IA"}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">
              {language === "en"
                ? "Smart financial insights at your fingertips"
                : "Análisis financieros inteligentes al alcance de tu mano"}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {language === "en"
                ? "Rico's AI analyzes your spending patterns and provides personalized recommendations."
                : "La IA de Rico analiza tus patrones de gasto y proporciona recomendaciones personalizadas."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Expense Summary Example */}
            <div className="bg-background rounded-xl overflow-hidden border border-border shadow-md">
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-900 dark:text-white">
                  {language === "en"
                    ? "Here's your expense summary for March 2025:"
                    : "Aquí está tu resumen de gastos para marzo 2025:"}
                </p>
              </div>
              <div className="p-3">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-500 dark:text-gray-400">
                    {language === "en" ? "Total Spending" : "Gasto Total"}
                  </span>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">$1,245.72</span>
                </div>
                <div className="space-y-2">
                  {[
                    { name: { en: "Food", es: "Comida" }, amount: 320.45, color: "hsl(0, 70%, 60%)" },
                    { name: { en: "Housing", es: "Vivienda" }, amount: 650.0, color: "hsl(60, 70%, 60%)" },
                    { name: { en: "Transportation", es: "Transporte" }, amount: 125.27, color: "hsl(120, 70%, 60%)" },
                    {
                      name: { en: "Entertainment", es: "Entretenimiento" },
                      amount: 150.0,
                      color: "hsl(180, 70%, 60%)",
                    },
                  ].map((category, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: category.color }} />
                        <span className="text-gray-700 dark:text-gray-300">{category.name[language]}</span>
                      </div>
                      <span className="text-gray-900 dark:text-white">${category.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Budget Status Example */}
            <div className="bg-background rounded-xl overflow-hidden border border-border shadow-md">
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-900 dark:text-white">
                  {language === "en"
                    ? "Here's your current budget status for Entertainment:"
                    : "Aquí está el estado actual de tu presupuesto para Entretenimiento:"}
                </p>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{language === "en" ? "Entertainment" : "Entretenimiento"}</span>
                  <span className="text-sm text-muted-foreground">Mar 1 - Mar 31, 2025</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-bold">$175.50</span>
                  <span className="text-sm">{language === "en" ? "of" : "de"} $200.00</span>
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full mb-4">
                  <div
                    className="h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    style={{ width: "88%" }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-500">$24.50 {language === "en" ? "remaining" : "restante"}</span>
                  <span>88% {language === "en" ? "used" : "usado"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {language === "en"
              ? "Ready to take control of your finances?"
              : "¿Listo para tomar el control de tus finanzas?"}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {language === "en"
              ? "Join thousands of users who are already managing their money smarter with Rico."
              : "Únete a miles de usuarios que ya están administrando su dinero de manera más inteligente con Rico."}
          </p>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100"
            onClick={() => setShowSignupModal(true)}
          >
            {language === "en" ? "Get Started Free" : "Comenzar Gratis"}
          </Button>
        </div>
      </section>

      {/* FAQ Section - Moved after CTA and made collapsible */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <p className="text-sm font-medium tracking-widest text-blue-500">
              {language === "en" ? "FAQ" : "PREGUNTAS FRECUENTES"}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">
              {language === "en" ? "Frequently Asked Questions" : "Preguntas Frecuentes"}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {language === "en"
                ? "Find answers to common questions about Rico."
                : "Encuentra respuestas a preguntas comunes sobre Rico."}
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {faqItems.map((item, index) => (
              <div key={index} className="bg-background rounded-xl overflow-hidden border border-border shadow-sm">
                <div className="p-5 flex justify-between items-center cursor-pointer" onClick={() => toggleFaq(index)}>
                  <h3 className="text-lg font-semibold">{item.question[language]}</h3>
                  <button className="flex-shrink-0 text-muted-foreground hover:text-foreground">
                    {expandedFaq === index ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  </button>
                </div>
                {expandedFaq === index && (
                  <div className="px-5 pb-5 pt-0">
                    <p className="text-muted-foreground">{item.answer[language]}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted/50 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex justify-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Rico
            </h2>
          </div>
          <div className="text-center text-muted-foreground">
            <p>
              © 2025 Rico Financial. {language === "en" ? "All rights reserved." : "Todos los derechos reservados."}
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignup={() => {
          setShowLoginModal(false)
          setShowSignupModal(true)
        }}
      />

      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSwitchToLogin={() => {
          setShowSignupModal(false)
          setShowLoginModal(true)
        }}
      />
    </div>
  )
}

