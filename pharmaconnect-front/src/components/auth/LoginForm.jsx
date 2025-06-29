"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../../hooks/useAuth"

const LoginForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)


    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      })
const { user, token } = res.data;
user.token = token; // on ajoute le token dans l'objet user
login(user);        // on envoie tout l'objet user au contexte

      navigate("/")
    } catch (err) {
      setError(err.response?.data?.error || "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
      {/* Background Elements matching PharmaConnect style */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#1D10FA]/20 to-purple-600/20 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-600/20 to-blue-400/20 rounded-full opacity-30 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Main Login Card - PharmaConnect Style */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          {/* Header Section - Matching PharmaConnect Header */}
          <div className="bg-gradient-to-r from-[#1D10FA] to-purple-600 text-white py-8 px-8 shadow-2xl">
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2">PharmaConnect</h1>
              <p className="text-blue-100 text-lg">Connectez-vous à votre espace</p>
            </div>

            {/* Stats-like cards for visual appeal */}
           
            
          </div>

          {/* Form Content */}
          <div className="p-8">
            {/* Error Message - PharmaConnect Style */}
            {error && (
              <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 rounded-lg shadow-md animate-fade-in">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#1D10FA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Adresse Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre-email@exemple.com"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#1D10FA] transition-colors duration-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#1D10FA]/20"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#1D10FA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrez votre mot de passe"
                    required
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 focus:border-[#1D10FA] transition-colors duration-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#1D10FA]/20"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#1D10FA] transition-colors duration-200"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-[#1D10FA] border-gray-300 rounded focus:ring-[#1D10FA] focus:ring-2"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-[#1D10FA] transition-colors duration-200">
                    Se souvenir de moi
                  </span>
                </label>
                <a
                  href="#"
                  className="text-sm font-semibold text-[#1D10FA] hover:text-purple-600 transition-colors duration-200 hover:underline"
                >
                  Mot de passe oublié ?
                </a>
              </div>

              {/* Submit Button - PharmaConnect Style */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#1D10FA] to-purple-600 hover:from-purple-600 hover:to-[#1D10FA] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    Se connecter
                  </>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Vous n'avez pas de compte ?{" "}
                <a
                  href="#"
                  className="font-semibold text-[#1D10FA] hover:text-purple-600 transition-colors duration-200 hover:underline"
                >
                  Créer un compte
                </a>
              </p>
            </div>

            {/* Social Login Options - PharmaConnect Style */}
           
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            En vous connectant, vous acceptez nos{" "}
            <a href="#" className="text-[#1D10FA] hover:text-purple-600 hover:underline font-medium">
              Conditions d'utilisation
            </a>{" "}
            et notre{" "}
            <a href="#" className="text-[#1D10FA] hover:text-purple-600 hover:underline font-medium">
              Politique de confidentialité
            </a>
          </p>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default LoginForm
