import React, { useState } from 'react'

const HomeIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)

const CarIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m3 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
  </svg>
)

const ShieldIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)

const ChartIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

const HeartIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
)

const BuildingIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
)

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const StarIcon = () => (
  <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
)

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2'
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl focus:ring-blue-500',
    secondary: 'bg-white text-blue-800 border-2 border-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    white: 'bg-white text-blue-800 hover:bg-gray-100 shadow-lg focus:ring-white'
  }
  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
)

const ProductCard = ({ icon, title, description, features }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 group">
    <div className="p-6">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start text-sm text-gray-600">
            <span className="text-green-500 mr-2 mt-0.5"><CheckIcon /></span>
            {feature}
          </li>
        ))}
      </ul>
      <Button variant="secondary" className="w-full">Saiba mais</Button>
    </div>
  </div>
)

const BenefitItem = ({ title, description }) => (
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
      <span className="text-green-600"><CheckIcon /></span>
    </div>
    <div>
      <h4 className="font-bold text-gray-800 mb-1">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </div>
)

const TestimonialCard = ({ name, role, content }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
    <div className="flex mb-4">
      {[...Array(5)].map((_, i) => (<StarIcon key={i} />))}
    </div>
    <p className="text-gray-600 mb-6 italic">"{content}"</p>
    <div className="flex items-center">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
        {name.charAt(0)}
      </div>
      <div>
        <p className="font-semibold text-gray-800">{name}</p>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  </div>
)

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Obrigado! Entraremos em contato em breve.')
    setEmail('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center text-white">
                <ShieldIcon />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-800">ConsórcioSeguros</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#solucoes" className="text-gray-600 hover:text-blue-600 transition-colors">Soluções</a>
              <a href="#produtos" className="text-gray-600 hover:text-blue-600 transition-colors">Produtos</a>
              <a href="#beneficios" className="text-gray-600 hover:text-blue-600 transition-colors">Benefícios</a>
              <a href="#depoimentos" className="text-gray-600 hover:text-blue-600 transition-colors">Depoimentos</a>
              <Button variant="primary" className="py-2 px-4">Simule agora</Button>
            </div>
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-4">
              <a href="#solucoes" className="block text-gray-600 hover:text-blue-600">Soluções</a>
              <a href="#produtos" className="block text-gray-600 hover:text-blue-600">Produtos</a>
              <a href="#beneficios" className="block text-gray-600 hover:text-blue-600">Benefícios</a>
              <a href="#depoimentos" className="block text-gray-600 hover:text-blue-600">Depoimentos</a>
              <Button variant="primary" className="w-full">Simule agora</Button>
            </div>
          </div>
        )}
      </nav>

      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Seu plano para{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">conquistar e proteger</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto lg:mx-0">
                Consórcios e seguros para você crescer com segurança e realizar seus objetivos
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button variant="white" className="text-lg px-8">Simule agora</Button>
                <Button variant="secondary" className="text-lg px-8 bg-transparent border-white text-white hover:bg-white/10">Fale com especialista</Button>
              </div>
              <div className="mt-10 flex items-center justify-center lg:justify-start space-x-6 text-blue-200 text-sm">
                <div className="flex items-center"><ShieldIcon /><span className="ml-2">+10 anos de mercado</span></div>
                <div className="flex items-center"><CheckIcon /><span className="ml-2">+50 mil clientes</span></div>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white"><HomeIcon /></div>
                    <div><h3 className="text-white font-bold text-lg">Planeje sua conquista</h3><p className="text-blue-200 text-sm">Consórcios sem juros para carro, casa ou negócio</p></div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 ml-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white"><ShieldIcon /></div>
                    <div><h3 className="text-white font-bold text-lg">Proteja o que importa</h3><p className="text-blue-200 text-sm">Seguros completos para sua vida e patrimônio</p></div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white"><ChartIcon /></div>
                    <div><h3 className="text-white font-bold text-lg">Controle financeiro inteligente</h3><p className="text-blue-200 text-sm">Soluções acessíveis e previsíveis</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="solucoes" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Soluções completas para construir e proteger seu patrimônio</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Oferecemos um portfólio completo de produtos financeiros</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard icon={<HomeIcon />} title="Consórcios acessíveis" description="Planos flexíveis para aquisição de imóveis, veículos e serviços" />
            <FeatureCard icon={<ShieldIcon />} title="Seguros personalizados" description="Coberturas sob medida para proteger sua vida e patrimônio" />
            <FeatureCard icon={<ChartIcon />} title="Planejamento financeiro" description="Estratégias inteligentes para organizar suas finanças" />
            <FeatureCard icon={<HeartIcon />} title="Suporte especializado" description="Equipe de especialistas pronta para orientar você" />
          </div>
        </div>
      </section>

      <section id="produtos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Nossos Produtos</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Escolha a solução ideal para cada momento da sua vida</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProductCard icon={<CarIcon />} title="Consórcio de Veículos" description="Realize o sonho do carro novo com parcelas fixas" features={["Sem juros", "Parcelas fixas", "Lance opcional", "Até 80 meses"]} />
            <ProductCard icon={<HomeIcon />} title="Consórcio Imobiliário" description="Adquira seu imóvel dos sonhos ou invista" features={["Compra ou construção", "Reforma e ampliação", "Lance embutido", "Até 240 meses"]} />
            <ProductCard icon={<HeartIcon />} title="Seguro de Vida" description="Proteja quem você ama com coberturas completas" features={["Morte e invalidez", "Doenças graves", "Assistência funeral", "Renda mensal"]} />
            <ProductCard icon={<BuildingIcon />} title="Seguro Patrimonial" description="Proteção completa para residência ou empresa" features={["Incêndio e roubo", "Danos elétricos", "Responsabilidade civil", "Assistência 24h"]} />
          </div>
        </div>
      </section>

      <section id="beneficios" className="py-20 bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">Por que escolher nossos consórcios e seguros?</h2>
              <p className="text-lg text-gray-600 mb-8">Oferecemos vantagens exclusivas que fazem toda a diferença</p>
              <div className="space-y-6">
                <BenefitItem title="Sem juros" description="No consórcio você não paga juros, apenas taxa de administração transparente" />
                <BenefitItem title="Flexibilidade de pagamento" description="Parcelas que se adequam ao seu orçamento" />
                <BenefitItem title="Segurança e proteção" description="Produtos regulamentados pelo Banco Central" />
                <BenefitItem title="Planejamento de longo prazo" description="Construa patrimônio de forma consistente" />
              </div>
              <div className="mt-10"><Button variant="primary" className="text-lg px-8">Começar minha simulação</Button></div>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full text-white mb-4"><CheckIcon /></div>
                <h3 className="text-2xl font-bold text-gray-800">Vantagens Exclusivas</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl"><span className="text-gray-700 font-medium">Economia vs Financiamento</span><span className="text-green-600 font-bold">até 60%</span></div>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl"><span className="text-gray-700 font-medium">Taxa administrativa</span><span className="text-blue-600 font-bold">a partir de 10%</span></div>
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl"><span className="text-gray-700 font-medium">Clientes satisfeitos</span><span className="text-purple-600 font-bold">98%</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="depoimentos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">O que nossos clientes dizem</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Histórias reais de quem conquistou sonhos</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard name="Maria Silva" role="Empresária" content="Graças ao consórcio imobiliário, consegui comprar meu primeiro imóvel comercial!" />
            <TestimonialCard name="João Santos" role="Autônomo" content="O seguro de vida me deu tranquilidade para minha família. Processo rápido e transparente." />
            <TestimonialCard name="Ana Costa" role="Servidora Pública" content="Fiz dois consórcios simultâneos. As parcelas são fixas e cabe no meu orçamento." />
          </div>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-2xl"><p className="text-4xl font-bold text-blue-600 mb-2">+50mil</p><p className="text-gray-600">Clientes atendidos</p></div>
            <div className="text-center p-6 bg-green-50 rounded-2xl"><p className="text-4xl font-bold text-green-600 mb-2">R$2bi</p><p className="text-gray-600">Em contemplações</p></div>
            <div className="text-center p-6 bg-purple-50 rounded-2xl"><p className="text-4xl font-bold text-purple-600 mb-2">+10</p><p className="text-gray-600">Anos de mercado</p></div>
            <div className="text-center p-6 bg-orange-50 rounded-2xl"><p className="text-4xl font-bold text-orange-600 mb-2">98%</p><p className="text-gray-600">Satisfação</p></div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Pronto para começar seu planejamento?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">Dê o primeiro passo para conquistar seus objetivos e proteger o que importa.</p>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Digite seu melhor e-mail" className="flex-1 px-6 py-4 rounded-lg border-0 focus:ring-2 focus:ring-blue-400 text-gray-800" required />
              <Button variant="white" type="submit" className="px-8 whitespace-nowrap">Quero simular</Button>
            </div>
            <p className="text-blue-200 text-sm mt-4">🔒 Seus dados estão seguros. Não enviamos spam.</p>
          </form>
          <div className="flex flex-wrap items-center justify-center gap-6 text-blue-200 text-sm">
            <div className="flex items-center"><ShieldIcon /><span className="ml-2">Regulado pelo Banco Central</span></div>
            <div className="flex items-center"><CheckIcon /><span className="ml-2">Dados protegidos</span></div>
            <div className="flex items-center"><HeartIcon /><span className="ml-2">+50 mil clientes satisfeitos</span></div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white"><ShieldIcon /></div>
                <span className="ml-2 text-xl font-bold text-white">ConsórcioSeguros</span>
              </div>
              <p className="text-sm text-gray-400">Sua parceira para conquistar sonhos e proteger o que importa.</p>
            </div>
            <div><h4 className="font-semibold text-white mb-4">Produtos</h4><ul className="space-y-2 text-sm"><li><a href="#" className="hover:text-white transition-colors">Consórcio de Veículos</a></li><li><a href="#" className="hover:text-white transition-colors">Consórcio Imobiliário</a></li><li><a href="#" className="hover:text-white transition-colors">Seguro de Vida</a></li><li><a href="#" className="hover:text-white transition-colors">Seguro Patrimonial</a></li></ul></div>
            <div><h4 className="font-semibold text-white mb-4">Empresa</h4><ul className="space-y-2 text-sm"><li><a href="#" className="hover:text-white transition-colors">Sobre nós</a></li><li><a href="#" className="hover:text-white transition-colors">Blog</a></li><li><a href="#" className="hover:text-white transition-colors">Carreiras</a></li><li><a href="#" className="hover:text-white transition-colors">Contato</a></li></ul></div>
            <div><h4 className="font-semibold text-white mb-4">Legal</h4><ul className="space-y-2 text-sm"><li><a href="#" className="hover:text-white transition-colors">Termos de uso</a></li><li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li><li><a href="#" className="hover:text-white transition-colors">Cookies</a></li><li><a href="#" className="hover:text-white transition-colors">Compliance</a></li></ul></div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 ConsórcioSeguros. Todos os direitos reservados.</p>
            <p className="mt-2">Autorizado e regulamentado pelo Banco Central do Brasil.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
