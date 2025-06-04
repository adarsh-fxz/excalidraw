import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
              Draw, Sketch, and Collaborate
            </h1>
            <p className="text-xl text-gray-600">
              A powerful whiteboard tool for sketching, diagramming, and real-time collaboration.
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Start Drawing
              </button>
              <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>
          <div className="flex-1">
            <div className="relative w-full h-[400px] bg-gray-100 rounded-lg shadow-lg">
              {/* Placeholder for app screenshot */}
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                App Preview
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Real-time Collaboration",
                description: "Work together with your team in real-time, no matter where you are.",
                icon: "👥"
              },
              {
                title: "Intuitive Drawing",
                description: "Draw naturally with our powerful yet simple drawing tools.",
                icon: "✏️"
              },
              {
                title: "Export & Share",
                description: "Export your work in multiple formats and share with anyone.",
                icon: "📤"
              }
            ].map((feature, index) => (
              <div key={index} className="p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-blue-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Drawing?</h2>
          <p className="text-xl mb-8">Join thousands of users who are already creating amazing diagrams.</p>
          <button className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Get Started for Free
          </button>
        </div>
      </div>
    </div>
  );
}
