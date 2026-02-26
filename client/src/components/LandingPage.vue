<template>
  <div class="min-h-screen bg-[#030712] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
    <!-- Navigation -->
    <nav class="fixed top-0 w-full z-50 border-b border-white/5 bg-[#030712]/80 backdrop-blur-xl">
      <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <span class="text-xl font-black tracking-tight bg-gradient-to-br from-indigo-400 via-purple-400 to-fuchsia-400 text-transparent bg-clip-text">IRIS-TS</span>
        </div>
        
        <div class="hidden md:flex items-center gap-8">
          <a href="#features" class="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Features</a>
          <a href="#vision" class="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Vision</a>
          <button @click="$emit('enter')" class="px-5 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-slate-200 transition-all active:scale-95">
            Launch Engine
          </button>
        </div>

        <button @click="$emit('enter')" class="md:hidden p-2 text-slate-400">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </nav>

    <!-- Hero Section -->
    <main class="relative pt-32 pb-20 px-6 overflow-hidden">
      <!-- Background Glows -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/20 blur-[120px] rounded-full -z-10 animate-pulse"></div>
      <div class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-fuchsia-600/10 blur-[120px] rounded-full -z-10"></div>

      <div class="max-w-7xl mx-auto flex flex-col items-center text-center">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold text-indigo-400 uppercase tracking-[0.2em] mb-8 animate-fade-in">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Next Gen Frontend Synthesis
        </div>

        <h1 class="text-5xl md:text-8xl font-black tracking-tighter text-white mb-8 leading-[1.1] max-w-4xl">
          Synthesize <span class="bg-gradient-to-tr from-indigo-500 via-purple-400 to-fuchsia-500 text-transparent bg-clip-text">Visual Worlds</span> with AI.
        </h1>
        
        <p class="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed font-medium">
          IRIS-TS is a high-fidelity visual code synthesizer that transforms static imagery and conceptual prompts into production-ready front-end architectures in seconds.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 items-center">
          <button 
            @click="$emit('enter')" 
            class="group relative px-8 py-4 bg-white text-black font-black text-lg rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_rgba(255,255,255,0.1)] overflow-hidden"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-white/50 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            Start Scanning
          </button>
          
          <a 
            href="#features" 
            class="px-8 py-4 bg-white/5 text-white font-bold text-lg rounded-2xl border border-white/10 hover:bg-white/10 transition-all"
          >
            How it works
          </a>
        </div>

        <!-- Dashboard Preview Mockup -->
        <div class="mt-24 relative w-full max-w-5xl group">
             <div class="absolute inset-0 bg-gradient-to-t from-indigo-500/20 to-transparent blur-3xl opacity-50 -z-10 group-hover:opacity-70 transition-opacity"></div>
             <div class="rounded-3xl border border-white/10 bg-[#0B0F19]/80 backdrop-blur-xl p-2 shadow-2xl overflow-hidden aspect-video">
                <div class="w-full h-full rounded-2xl bg-[#05080F] flex items-center justify-center relative overflow-hidden">
                    <!-- Fake UI Elements -->
                    <div class="absolute top-4 left-4 flex gap-2">
                        <div class="w-3 h-3 rounded-full bg-rose-500/50"></div>
                        <div class="w-3 h-3 rounded-full bg-amber-500/50"></div>
                        <div class="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                    </div>
                    
                    <!-- Inner Grid Layout -->
                    <div class="grid grid-cols-12 gap-4 w-full h-full p-8 pt-12">
                        <div class="col-span-3 space-y-4">
                            <div class="h-8 w-full rounded-lg bg-white/5 animate-pulse"></div>
                            <div class="h-32 w-full rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col items-center justify-center">
                                <svg class="w-8 h-8 text-indigo-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                <div class="h-2 w-16 rounded-full bg-indigo-400/30"></div>
                            </div>
                            <div class="h-24 w-full rounded-xl bg-white/5 border border-white/5"></div>
                            <div class="h-10 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                        </div>
                        <div class="col-span-9 flex flex-col gap-4">
                            <div class="h-12 w-full rounded-xl bg-white/5 flex items-center px-4 gap-4">
                                <div class="h-4 w-4 rounded-full bg-emerald-500/50"></div>
                                <div class="h-2 w-32 rounded-full bg-white/10"></div>
                            </div>
                            <div class="flex-1 w-full rounded-2xl bg-white/5 border border-white/10 shadow-inner relative group">
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <div class="text-center">
                                        <div class="relative inline-block">
                                            <div class="absolute inset-0 bg-white/20 blur-xl rounded-full animate-pulse"></div>
                                            <svg class="w-12 h-12 text-slate-700 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                                        </div>
                                        <div class="h-2 w-24 rounded-full bg-white/5 mx-auto mt-4"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
        </div>
      </div>
    </main>

    <!-- Features Grid -->
    <section id="features" class="py-32 px-6 relative">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-20">
          <h2 class="text-3xl md:text-5xl font-black text-white mb-6">Built for the <span class="bg-gradient-to-r from-emerald-400 to-cyan-400 text-transparent bg-clip-text">Modern Architect</span></h2>
          <p class="text-slate-400 font-medium text-lg max-w-2xl mx-auto">Skip the boilerplate and dive straight into assembly. IRIS-TS handles the heavy lifting of UI synthesis.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-all hover:translate-y-[-4px] group">
            <div class="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-4">Visual-to-Code</h3>
            <p class="text-slate-400 text-sm leading-relaxed font-medium">Capture any webpage, sketch, or design and let our engine extract the structural DNA to build clean, functional code.</p>
          </div>

          <!-- Feature 2 -->
          <div class="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all hover:translate-y-[-4px] group">
            <div class="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-4">Atmosphere Engine</h3>
            <p class="text-slate-400 text-sm leading-relaxed font-medium">Our proprietary engine doesn't just copy; it understands aesthetics, color theory, and modern UI patterns to create unique variants.</p>
          </div>

          <!-- Feature 3 -->
          <div class="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all hover:translate-y-[-4px] group">
            <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
            </div>
            <h3 class="text-xl font-bold text-white mb-4">Edge Deployment</h3>
            <p class="text-slate-400 text-sm leading-relaxed font-medium">Instantly deploy your synthesized creations to Vercel with a single click. Go from concept to live URL in under 2 minutes.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Vision Section -->
    <section id="vision" class="py-32 px-6 bg-white/[0.02]">
        <div class="max-w-4xl mx-auto text-center">
            <h2 class="text-[10px] uppercase font-bold tracking-[0.4em] text-indigo-400 mb-8">The Philosophy</h2>
            <blockquote class="text-3xl md:text-5xl font-black text-white italic leading-tight mb-12">
                "We believe the barrier between design and implementation should be as thin as a single breath of AI."
            </blockquote>
            <p class="text-slate-500 font-mono text-sm">— Team EisenDev / IRIS Core</p>
        </div>
    </section>

    <!-- Footer -->
    <footer class="py-20 px-6 border-t border-white/5">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div class="flex items-center gap-2 grayscale brightness-50">
          <div class="w-6 h-6 rounded bg-white flex items-center justify-center">
            <svg class="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
          </div>
          <span class="text-sm font-bold tracking-tighter text-white">IRIS Synth Engine</span>
        </div>
        
        <div class="text-slate-600 text-[10px] uppercase font-bold tracking-widest">
          &copy; 2026 EISENDEV. ALL RIGHTS RESERVED.
        </div>
        
        <div class="flex gap-6">
          <a href="#" class="text-slate-400 hover:text-white transition-colors"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>
          <a href="#" class="text-slate-400 hover:text-white transition-colors"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
defineEmits(['enter'])
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}

@keyframes scan {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

.animate-scan {
  animation: scan 2s ease-in-out infinite;
}
</style>
