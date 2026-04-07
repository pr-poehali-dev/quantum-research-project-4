import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import Icon from '@/components/ui/icon'

function SpinningLogo() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5
      groupRef.current.rotation.x += delta * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, 0]}>
        <octahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#06b6d4" wireframe transparent opacity={0.4} />
      </mesh>
    </group>
  )
}

function AnimatedBox({ initialPosition, colorIndex }: { initialPosition: [number, number, number]; colorIndex: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [targetPosition, setTargetPosition] = useState(new THREE.Vector3(...initialPosition))
  const currentPosition = useRef(new THREE.Vector3(...initialPosition))

  const colors = ['#8b5cf6', '#06b6d4', '#a78bfa', '#22d3ee', '#7c3aed', '#0891b2']
  const color = colors[colorIndex % colors.length]

  const getAdjacentIntersection = (current: THREE.Vector3) => {
    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]
    const randomDirection = directions[Math.floor(Math.random() * directions.length)]
    return new THREE.Vector3(
      current.x + randomDirection[0] * 3,
      0.5,
      current.z + randomDirection[1] * 3
    )
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const newPosition = getAdjacentIntersection(currentPosition.current)
      newPosition.x = Math.max(-15, Math.min(15, newPosition.x))
      newPosition.z = Math.max(-15, Math.min(15, newPosition.z))
      setTargetPosition(newPosition)
    }, 1500 + Math.random() * 1000)

    return () => clearInterval(interval)
  }, [])

  useFrame(() => {
    if (meshRef.current) {
      currentPosition.current.lerp(targetPosition, 0.05)
      meshRef.current.position.copy(currentPosition.current)
    }
  })

  return (
    <mesh ref={meshRef} position={initialPosition}>
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.15} opacity={0.85} transparent />
      <lineSegments>
        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(0.8, 0.8, 0.8)]} />
        <lineBasicMaterial attach="material" color={color} linewidth={2} />
      </lineSegments>
    </mesh>
  )
}

function Scene() {
  const initialPositions: [number, number, number][] = [
    [-9, 0.5, -9],
    [-3, 0.5, -3],
    [0, 0.5, 0],
    [3, 0.5, 3],
    [9, 0.5, 9],
    [-6, 0.5, 6],
    [6, 0.5, -6],
    [-12, 0.5, 0],
    [12, 0.5, 0],
    [0, 0.5, 12],
  ]

  return (
    <>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#8b5cf6" />
      <pointLight position={[-10, 10, -10]} intensity={0.6} color="#06b6d4" />
      <Grid
        renderOrder={-1}
        position={[0, 0, 0]}
        infiniteGrid
        cellSize={1}
        cellThickness={0.4}
        sectionSize={3}
        sectionThickness={0.8}
        sectionColor={[0.4, 0.2, 0.8]}
        fadeDistance={50}
      />
      {initialPositions.map((position, index) => (
        <AnimatedBox key={index} initialPosition={position} colorIndex={index} />
      ))}
    </>
  )
}

const stats = [
  { value: '99.9%', label: 'Uptime' },
  { value: '<50ms', label: 'Задержка' },
  { value: '10K+', label: 'Узлов' },
]

const Index = () => {
  return (
    <div className="relative w-full min-h-screen bg-black text-white overflow-x-hidden font-inter">
      {/* Hero Section */}
      <div className="relative w-full h-screen overflow-hidden">
        <header className="absolute top-0 left-0 right-0 z-10 p-4">
          <nav className="flex justify-between items-center max-w-6xl mx-auto">
            <div className="flex items-center gap-1">
              <div className="w-16 h-16">
                <Canvas camera={{ position: [0, 0, 5] }}>
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} />
                  <SpinningLogo />
                </Canvas>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                NexusFlow
              </span>
            </div>
            <ul className="hidden md:flex space-x-6 text-sm">
              <li><a href="#features" className="text-gray-400 hover:text-white transition">Возможности</a></li>
              <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition">Как работает</a></li>
              <li><a href="#pricing" className="text-gray-400 hover:text-white transition">Тарифы</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white transition">Контакты</a></li>
            </ul>
            <button className="hidden md:block bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium py-2 px-5 rounded-lg transition">
              Начать
            </button>
          </nav>
        </header>

        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10 px-4 w-full max-w-4xl">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm">
            Новое поколение оркестрации
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            Управляйте{' '}
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              потоками данных
            </span>
            {' '}без хаоса
          </h1>
          <p className="text-lg md:text-xl mb-10 text-gray-400 max-w-2xl mx-auto">
            Единая платформа для оркестрации распределённых сервисов. Мониторинг, маршрутизация и масштабирование — в одном интерфейсе.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3.5 px-8 rounded-lg transition shadow-lg shadow-violet-600/25">
              Получить ранний доступ
            </button>
            <button className="border border-white/20 hover:border-white/40 text-white font-medium py-3.5 px-8 rounded-lg transition backdrop-blur-sm">
              Смотреть демо
            </button>
          </div>

          <div className="flex justify-center gap-12 mt-14">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <Canvas shadows camera={{ position: [30, 30, 30], fov: 50 }} className="absolute inset-0">
          <Scene />
        </Canvas>

        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent z-[5]" />
      </div>

      {/* Features Section */}
      <section id="features" className="relative z-10 bg-black py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Почему выбирают{' '}
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">NexusFlow</span>
            </h3>
            <p className="text-gray-400 max-w-xl mx-auto">
              Всё необходимое для управления сложной инфраструктурой — без сложности
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="group bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-sm rounded-xl p-8 border border-white/[0.06] hover:border-violet-500/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center mb-5">
                <Icon name="LayoutDashboard" size={24} className="text-violet-400" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Единый центр управления</h4>
              <p className="text-gray-400 leading-relaxed">Контролируйте все распределённые сервисы из интуитивной панели с мониторингом в реальном времени.</p>
            </div>
            <div className="group bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-sm rounded-xl p-8 border border-white/[0.06] hover:border-cyan-500/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-5">
                <Icon name="Route" size={24} className="text-cyan-400" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Умная маршрутизация</h4>
              <p className="text-gray-400 leading-relaxed">Интеллектуальное распределение трафика обеспечивает оптимальную производительность и надёжность всех узлов.</p>
            </div>
            <div className="group bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-sm rounded-xl p-8 border border-white/[0.06] hover:border-purple-500/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-5">
                <Icon name="ShieldCheck" size={24} className="text-purple-400" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Нулевой простой</h4>
              <p className="text-gray-400 leading-relaxed">Автоматическое переключение и балансировка нагрузки поддерживают работу приложений без перебоев.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative z-10 bg-black py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Как это работает</h3>
            <p className="text-gray-400 max-w-xl mx-auto">Три шага до полного контроля над инфраструктурой</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Подключите сервисы', desc: 'Интегрируйте существующие сервисы за минуты через SDK или API. Поддерживаем все популярные облака.', icon: 'Plug' },
              { step: '02', title: 'Настройте потоки', desc: 'Визуальный конструктор позволяет создавать маршруты данных без написания кода.', icon: 'GitBranch' },
              { step: '03', title: 'Масштабируйтесь', desc: 'Система автоматически адаптируется к нагрузке и оптимизирует использование ресурсов.', icon: 'TrendingUp' },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="text-6xl font-extrabold text-white/[0.04] absolute top-0 left-1/2 -translate-x-1/2">{item.step}</div>
                <div className="relative pt-10">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center mx-auto mb-5">
                    <Icon name={item.icon} size={24} className="text-white" />
                  </div>
                  <h4 className="text-xl font-semibold mb-3">{item.title}</h4>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10 bg-black py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Простые тарифы</h3>
            <p className="text-gray-400 max-w-xl mx-auto">Выберите план, который подходит вашей команде</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Старт', price: 'Бесплатно', desc: 'Для небольших проектов', features: ['До 5 сервисов', 'Базовый мониторинг', 'Community-поддержка', '1 ГБ логов'] },
              { name: 'Про', price: '₽4 990/мес', desc: 'Для растущих команд', features: ['До 50 сервисов', 'Продвинутая аналитика', 'Приоритетная поддержка', '50 ГБ логов', 'Кастомные алерты'], popular: true },
              { name: 'Корпоративный', price: 'По запросу', desc: 'Для крупного бизнеса', features: ['Без ограничений', 'SLA 99.99%', 'Выделенный менеджер', 'On-premise вариант', 'Кастомные интеграции'] },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl p-8 border transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-b from-violet-500/10 to-transparent border-violet-500/30 shadow-lg shadow-violet-500/10 scale-105'
                    : 'bg-white/[0.03] border-white/[0.06] hover:border-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="text-violet-400 text-xs font-semibold uppercase tracking-wider mb-4">Популярный</div>
                )}
                <h4 className="text-xl font-bold">{plan.name}</h4>
                <p className="text-gray-500 text-sm mt-1 mb-4">{plan.desc}</p>
                <div className="text-3xl font-extrabold mb-6">{plan.price}</div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-gray-300 text-sm">
                      <Icon name="Check" size={16} className="text-violet-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-lg font-medium transition ${
                    plan.popular
                      ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/25'
                      : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                  }`}
                >
                  Выбрать план
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section id="contact" className="relative z-10 bg-black py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Готовы к{' '}
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              следующему уровню
            </span>?
          </h3>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto">
            Запишитесь на демо — покажем, как NexusFlow упростит вашу инфраструктуру уже на первой неделе.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Ваш email"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-violet-500/50 transition"
            />
            <button className="bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 px-6 rounded-lg transition shadow-lg shadow-violet-600/25 whitespace-nowrap">
              Записаться
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] bg-black py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-sm text-gray-500">© 2026 NexusFlow. Все права защищены.</span>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition">Политика конфиденциальности</a>
            <a href="#" className="hover:text-white transition">Условия использования</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Index