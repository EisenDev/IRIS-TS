<template>
  <div class="h-screen w-full flex bg-[#030712] text-slate-200 font-sans overflow-hidden selection:bg-indigo-500/30">
    <!-- Sidebar / Control Panel -->
    <div class="w-80 flex-shrink-0 flex flex-col border-r border-slate-800/60 bg-[#0B0F19] relative z-20 shadow-2xl">
      <!-- Header -->
      <div class="p-6 border-b border-slate-800/60 bg-gradient-to-b from-slate-900 to-transparent">
        <h1 class="text-2xl font-black tracking-tight bg-gradient-to-br from-indigo-400 via-purple-400 to-fuchsia-400 text-transparent bg-clip-text drop-shadow-sm">IRIS-TS</h1>
        <p class="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase mt-1">Atmosphere Engine</p>
      </div>

      <!-- Action Panel -->
      <div class="p-6 flex-1 overflow-y-auto flex flex-col gap-6 no-scrollbar">
        <!-- Input Selector -->
        <div class="space-y-3">
          <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <svg class="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
            1. Visual Input
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button 
              type="button"
              @click="triggerUpload" 
              class="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-700/50 hover:border-indigo-500/50 bg-slate-800/30 hover:bg-indigo-500/10 transition-all group"
            >
              <svg class="w-5 h-5 text-slate-400 group-hover:text-indigo-400 mb-1 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              <span class="text-[11px] font-semibold text-slate-300">Upload Data</span>
            </button>
            <button 
              type="button"
              @click="startCamera" 
              class="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-700/50 hover:border-fuchsia-500/50 bg-slate-800/30 hover:bg-fuchsia-500/10 transition-all group"
            >
              <svg class="w-5 h-5 text-slate-400 group-hover:text-fuchsia-400 mb-1 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
              <span class="text-[11px] font-semibold text-slate-300">Live Lens</span>
            </button>
            <input type="file" ref="fileInputRef" @change="handleFileUpload" accept="image/*" class="hidden" />
          </div>
        </div>

        <!-- Media Viewport -->
        <div class="relative w-full aspect-[4/3] bg-[#05080f] rounded-xl overflow-hidden border border-slate-700/50 shadow-inner group">
          <div v-if="!isCameraOpen && !capturedImage" class="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
            <svg class="w-8 h-8 mb-2 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span class="text-[10px] font-medium uppercase tracking-widest">No Signal</span>
          </div>

          <video v-show="isCameraOpen && !capturedImage" ref="videoRef" autoplay playsinline class="w-full h-full object-cover"></video>
          <img v-if="capturedImage" :src="capturedImage" alt="Captured Scene" class="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
          <canvas ref="canvasRef" class="hidden"></canvas>
          
          <!-- Scanning Overlay -->
          <div v-if="isGenerating" class="absolute inset-0 bg-indigo-950/40 backdrop-blur-[2px] flex items-center justify-center overflow-hidden">
            <div class="h-1 w-full bg-indigo-400/80 absolute top-0 shadow-[0_0_20px_rgba(99,102,241,1)] animate-[scan_2s_ease-in-out_infinite]"></div>
            <div class="px-3 py-1.5 bg-indigo-900/80 border border-indigo-500/30 rounded-full text-[10px] font-bold text-indigo-300 tracking-[0.2em] uppercase backdrop-blur-md">Analyzing</div>
          </div>

          <!-- Camera Controls Overlay -->
          <div v-if="isCameraOpen && !capturedImage" class="absolute bottom-3 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button type="button" @click="takePhoto" class="w-12 h-12 rounded-full border-4 border-white/30 bg-white/20 hover:bg-white hover:border-white transition-all backdrop-blur-sm"></button>
          </div>
        </div>

        <!-- Custom Prompt -->
        <div class="space-y-2">
          <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <svg class="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            2. Structural Prompt
          </label>
          <textarea
            v-model="userPrompt"
            class="w-full h-24 bg-[#05080f] border border-slate-700/50 rounded-xl p-3 text-xs text-slate-300 outline-none focus:border-purple-500/50 transition-colors resize-none placeholder-slate-600 custom-textarea"
            placeholder="e.g., Build a modern clothing brand landing page using this vibe. Include a hero section, products grid, and footer."
          ></textarea>
        </div>

        <!-- Synthesis Core -->
        <div class="space-y-3 pt-2">
          <button 
            type="button"
            @click="generateUI" 
            :disabled="!capturedImage || isGenerating"
            class="w-full relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 transition-all duration-500 group-hover:scale-[1.05]"></div>
            <div class="relative px-4 py-3.5 flex items-center justify-center gap-2 text-white font-bold tracking-wide text-sm">
              <svg v-if="isGenerating" class="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              {{ isGenerating ? 'Synthesizing Frontend...' : 'Initialize Engine' }}
            </div>
          </button>
          
          <button 
            type="button"
            v-if="capturedImage && !isGenerating"
            @click="resetCamera" 
            class="w-full px-4 py-2 bg-transparent hover:bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 text-slate-400 rounded-xl font-medium text-xs transition-all"
          >
            Clear Input Data
          </button>
        </div>

        <!-- Identity Output -->
        <transition name="fade">
          <div class="mt-2" v-if="generationTheme">
            <div class="flex flex-col gap-3 p-4 bg-[#05080f] rounded-xl border border-slate-800 relative shadow-inner">
              <div class="flex items-center justify-between pointer-events-none">
                <span class="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Atmosphere</span>
                <span class="text-[10px] font-bold text-fuchsia-400 bg-fuchsia-400/10 px-2 py-0.5 rounded-full border border-fuchsia-400/20 max-w-[150px] truncate" :title="generationTheme">{{ generationTheme }}</span>
              </div>
              <div class="grid grid-cols-6 gap-2">
                <div 
                  v-for="(color, index) in generationColors.slice(0, 12)" 
                  :key="index" 
                  class="group relative w-full aspect-square rounded-full border border-slate-700 shadow-[0_2px_10px_rgba(0,0,0,0.5)] cursor-pointer hover:z-10 transition-transform hover:scale-110"
                  :style="{ backgroundColor: color }"
                >
                  <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] font-mono rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg shadow-black/50 border border-slate-700 z-50">
                    {{ color }}
                    <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Main Workspace -->
    <div class="flex-1 flex flex-col min-w-0 bg-[#060912] relative z-10">
      
      <!-- Top Workspace Nav / Deploy Tools -->
      <div class="h-16 border-b border-slate-800/60 bg-[#0B0F19] flex items-center justify-between px-6">
        <div class="flex items-center gap-3">
          <div class="w-2 h-2 rounded-full" :class="generatedFiles.length > 0 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-slate-700'"></div>
          <span class="text-xs font-bold text-slate-300 tracking-[0.1em] uppercase">Live Architecture Output</span>
        </div>
        
        <div v-if="generatedFiles.length > 0" class="flex gap-2">
          <button @click="downloadZip" class="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors border border-slate-700">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export .ZIP Source
          </button>
          <button class="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors border border-emerald-500/30 cursor-not-allowed opacity-50 relative group">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
            Deploy Live (1 Lume)
            <div class="absolute top-full right-0 mt-2 px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap shadow-lg border border-slate-700 pointer-events-none">Coming Soon: Connect Vercel Token</div>
          </button>
        </div>
      </div>

      <!-- Split View -->
      <div class="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <!-- Live Preview -->
        <div class="flex-1 relative bg-slate-950/50 order-2 lg:order-1 flex flex-col">
          <!-- Empty State -->
          <div v-if="generatedFiles.length === 0 && !isGenerating" class="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
            <div class="relative w-32 h-32 mb-8 flex items-center justify-center">
              <div class="absolute inset-0 border border-slate-800 rounded-full animate-[spin_10s_linear_infinite] opacity-50"></div>
              <div class="absolute inset-4 border border-slate-700 rounded-full animate-[spin_7s_linear_infinite_reverse] opacity-50"></div>
              <svg class="w-10 h-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
            </div>
            <h2 class="text-lg font-semibold tracking-[0.15em] uppercase text-slate-300">Engine Standby</h2>
            <p class="text-slate-500 text-xs mt-3 max-w-xs text-center leading-relaxed font-medium">Capture or upload visual context to synthesize the reactive structural layer.</p>
          </div>
          
          <!-- Loading State -->
          <div v-if="isGenerating" class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#060912]/80 backdrop-blur-md">
            <div class="w-20 h-20 relative">
              <div class="absolute inset-0 border-4 border-indigo-500/10 rounded-full"></div>
              <div class="absolute inset-0 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
            <p class="mt-6 text-indigo-400 text-xs font-bold tracking-[0.2em] uppercase animate-pulse">Building Architecture</p>
          </div>

          <!-- Iframe Render -->
          <div class="flex-1 p-4 lg:p-8 overflow-hidden z-20">
             <div 
               class="w-full h-full bg-white rounded-2xl overflow-hidden border border-slate-700/40 relative shadow-2xl transition-opacity duration-500"
               :class="(generatedFiles.length > 0 || iframeSrcDoc) && !isGenerating ? 'opacity-100' : 'opacity-0'"
             >
                <iframe 
                  v-if="generatedFiles.length > 0 || iframeSrcDoc"
                  ref="iframeRef"
                  :srcdoc="iframeSrcDoc" 
                  class="w-full h-full border-none"
                  sandbox="allow-scripts allow-same-origin allow-popups"
                ></iframe>
             </div>
          </div>
        </div>

        <!-- File Explorer & Code Editor -->
        <div class="w-full lg:w-[450px] flex-shrink-0 flex flex-col border-t lg:border-t-0 lg:border-l border-slate-800/60 bg-[#0B0F19] order-1 lg:order-2">
          
          <!-- File Tabs Header -->
          <div class="flex items-center overflow-x-auto bg-slate-900 border-b border-slate-800/60 no-scrollbar">
            <button 
              v-for="(file, index) in generatedFiles" 
              :key="index"
              @click="activeFileIndex = index"
              class="px-5 py-3 text-[11px] font-mono font-bold tracking-widest uppercase border-r border-slate-800/60 whitespace-nowrap transition-colors"
              :class="activeFileIndex === index ? 'text-indigo-400 bg-[#0B0F19] border-t-[3px] border-t-indigo-500' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800 border-t-[3px] border-t-transparent pt-[15px]'"
            >
              {{ file.name }}
            </button>
          </div>

          <!-- Active Code Content -->
          <div class="flex-1 relative bg-[#05080f]">
            <textarea 
              v-if="activeFile"
              v-model="activeFile.content"
              class="absolute inset-0 w-full h-full bg-transparent text-emerald-400/90 p-6 font-mono text-[13px] leading-relaxed resize-none outline-none selection:bg-emerald-500/20 no-scrollbar custom-textarea"
              spellcheck="false"
              placeholder="// Source..."
            ></textarea>
            <div v-else class="absolute inset-0 flex items-center justify-center text-slate-700 font-mono text-xs uppercase tracking-widest">
              No files mapped
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted, computed } from 'vue'
import JSZip from 'jszip'

const isCameraOpen = ref(false)
const capturedImage = ref<string | null>(null)
const userPrompt = ref('')
const isGenerating = ref(false)

// Replaced simple code string with robust file tree
const generatedFiles = ref<{name: string, content: string}[]>([])
const activeFileIndex = ref(0)
const iframeSrcDoc = ref('')

const activeFile = computed(() => {
  if (generatedFiles.value.length > 0 && activeFileIndex.value < generatedFiles.value.length) {
    return generatedFiles.value[activeFileIndex.value]
  }
  return null
})

const generationTheme = ref('')
const generationColors = ref<string[]>([])

const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const streamRef = ref<MediaStream | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

const triggerUpload = () => { fileInputRef.value?.click() }

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      capturedImage.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment' }, audio: false 
    })
    streamRef.value = stream
    if (videoRef.value) videoRef.value.srcObject = stream
    isCameraOpen.value = true
    capturedImage.value = null
  } catch (err) {
    console.error(err)
    alert('Unable to access camera.')
  }
}

const stopCamera = () => {
  if (streamRef.value) {
    streamRef.value.getTracks().forEach(track => track.stop())
    streamRef.value = null
  }
  isCameraOpen.value = false
}

const takePhoto = () => {
  if (videoRef.value && canvasRef.value) {
    const video = videoRef.value
    const canvas = canvasRef.value
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const context = canvas.getContext('2d')
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      capturedImage.value = canvas.toDataURL('image/jpeg', 0.8)
      stopCamera()
    }
  }
}

const resetCamera = () => {
  capturedImage.value = null
}

const generateUI = async () => {
  if (!capturedImage.value) return
  isGenerating.value = true
  
  try {
    const response = await fetch('http://127.0.0.1:3000/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        image: capturedImage.value,
        userPrompt: userPrompt.value 
      })
    })
    if (!response.ok) throw new Error(`Server error: ${response.statusText}`)
    
    const data = await response.json()
    if (data.files) {
      generatedFiles.value = data.files
      activeFileIndex.value = 0 // Auto-focus the first file (index.html)
      generationTheme.value = data.theme_name || 'Generated Theme'
      generationColors.value = data.colors || []
    } else if (data.error) {
       alert('Server error: ' + data.error)
    }
  } catch (err: any) {
    alert(err.message || 'Error connecting to backend.')
  } finally {
    isGenerating.value = false
  }
}

const downloadZip = async () => {
  if (generatedFiles.value.length === 0) return;
  const zip = new JSZip();
  
  // Add all mapped files to ZIP folder structure
  generatedFiles.value.forEach(file => {
    zip.file(file.name, file.content);
  });
  
  // Add a nice read.me detailing this came from IRIS-TS
  zip.file('README.md', '# Generated by IRIS-TS\n\nAtmosphere Engine Architecture.\nTheme: ' + generationTheme.value + '\n\nTo run locally, just open `index.html` in your browser.');

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `IRIS-TS-${generationTheme.value.replace(/\s+/g, '-').toLowerCase()}-source.zip`;
  a.click();
  
  URL.revokeObjectURL(url);
}

// Watch specifically for changes to the HTML file in the array to update the iframe preview Live
watch(generatedFiles, (newFiles) => {
  if (!newFiles || newFiles.length === 0) return
  
  const htmlFile = newFiles.find(f => f.name.toLowerCase().endsWith('.html'))
  if (!htmlFile) return;

  let sourceHTML = htmlFile.content
  
  // Inject the anti-white-screen logic right before closing </body>
  const safetyScript = `
      <script>
        /* Nulify all interactive redirects/submits to prevent white-screens in IRIS-TS iframe */
        document.addEventListener('submit', (e) => e.preventDefault());
        document.addEventListener('click', (e) => {
           let target = e.target;
           while (target && target !== document) {
              if (target.tagName === 'A' || (target.tagName === 'BUTTON' && target.type !== 'button')) {
                 e.preventDefault();
              }
              target = target.parentNode;
           }
        });
      <\/script>
    </body>
  `;
  sourceHTML = sourceHTML.replace(/<\/body>/i, safetyScript);

  iframeSrcDoc.value = sourceHTML;
}, { deep: true })

onUnmounted(() => stopCamera())
</script>

<style>
@keyframes scan {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(1000%); } 
}
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.custom-textarea::-webkit-scrollbar { width: 6px; }
.custom-textarea::-webkit-scrollbar-track { background: transparent; }
.custom-textarea::-webkit-scrollbar-thumb { background-color: rgba(16, 185, 129, 0.2); border-radius: 20px; }
.custom-textarea::-webkit-scrollbar-thumb:hover { background-color: rgba(16, 185, 129, 0.5); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
