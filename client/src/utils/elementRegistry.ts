import { BookOpen, Dumbbell, Apple, Sparkles, Leaf, Plus } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// Define the interface for an Element definition
export interface ElementDef {
  key: string;            // e.g. 'libro', 'mancuerna', 'manzana', 'yoga'
  name: string;           // Display name, e.g. 'Libro Antiguo', 'Mancuerna', 'Manzana'
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  themeProgressBg: string;
  themeText: string;
  glowStyle: string;
  hasSprite: boolean;     // True if we have png sprites on disk
  spriteFolder?: string;  // Folder name under /assets/elements/
  maxPhase: number;
  typeLabel: string;      // Category label, e.g. 'Intelecto y Foco'
  phases: { name: string; desc: string }[];
}

// Eager glob matches all .png files inside client/src/assets/elements as compiled URL strings
const pngFiles = import.meta.glob('../assets/elements/**/*.png', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

// Predefined configurations for folders
const KNOWN_ELEMENTS: Record<string, Partial<ElementDef>> = {
  libro: {
    name: 'Libro Antiguo',
    icon: BookOpen,
    iconColor: 'text-[#accebf]',
    iconBg: 'bg-[#1b2b24] border border-[#2e5241]/35',
    themeProgressBg: 'bg-[#accebf]',
    themeText: 'text-[#accebf]',
    glowStyle: 'shadow-[0_0_25px_rgba(172,206,191,0.05)]',
    typeLabel: 'Intelecto y Foco',
    phases: [
      { name: 'Libro simple', desc: 'Un libro cerrado sobre una mesa oscura. El comienzo de la curiosidad.' },
      { name: 'Pequeña colección', desc: 'Tres libros apilados. Tu interés por aprender se empieza a notar.' },
      { name: 'Biblioteca organizada', desc: 'Una estantería de madera. Tu conocimiento está bien estructurado.' },
      { name: 'Espacio intelectual', desc: 'Escritorio con tintero, velas y pluma. La sabiduría guía tus días.' },
    ]
  },
  mancuerna: {
    name: 'Mancuerna',
    icon: Dumbbell,
    iconColor: 'text-[#ebc246]',
    iconBg: 'bg-[#332a15] border border-[#594924]/35',
    themeProgressBg: 'bg-[#ebc246]',
    themeText: 'text-[#ebc246]',
    glowStyle: 'shadow-[0_0_25px_rgba(235,194,70,0.05)]',
    typeLabel: 'Fuerza y Disciplina',
    phases: [
      { name: 'Mancuerna simple', desc: 'Una mancuerna de metal. El compromiso inicial con tu cuerpo.' },
      { name: 'Par de pesas', desc: 'Varias pesas organizadas. Tu fuerza física va en aumento.' },
      { name: 'Banco de entrenamiento', desc: 'Área de fuerza con soporte. La disciplina esculpe tu físico.' },
      { name: 'Gimnasio personal', desc: 'Espacio completo con barras y discos. El templo de la disciplina.' },
    ]
  },
  manzana: {
    name: 'Manzana',
    icon: Apple,
    iconColor: 'text-[#ff7675]',
    iconBg: 'bg-[#2f1f1f] border border-[#5c2d2d]/35',
    themeProgressBg: 'bg-[#ff7675]',
    themeText: 'text-[#ff7675]',
    glowStyle: 'shadow-[0_0_25px_rgba(255,118,117,0.05)]',
    typeLabel: 'Alimentación y Salud',
    phases: [
      { name: 'Manzana fresca', desc: 'Una manzana roja y crujiente. El símbolo de la nutrición consciente.' },
      { name: 'Cesta de frutas', desc: 'Una variedad de frutas frescas. Tu alimentación limpia se consolida.' },
      { name: 'Huerto en casa', desc: 'Pequeñas plantas frutales. Cosechando los frutos de tu constancia.' },
      { name: 'Árbol frutal', desc: 'Un manzano floreciente. La vitalidad de tu cuerpo es plena.' }
    ]
  }
};

const VIRTUAL_ELEMENTS: ElementDef[] = [
  {
    key: 'yoga',
    name: 'Esterilla Yoga',
    icon: Sparkles,
    iconColor: 'text-primary',
    iconBg: 'bg-[#2f271d] border border-[#4d3d2c]/35',
    themeProgressBg: 'bg-primary',
    themeText: 'text-primary',
    glowStyle: 'shadow-[0_0_25px_rgba(247,187,126,0.05)]',
    hasSprite: false,
    maxPhase: 4,
    typeLabel: 'Calma y Bienestar',
    phases: [
      { name: 'Esterilla enrollada', desc: 'Una esterilla en la esquina. El espacio de calma esperando ser abierto.' },
      { name: 'Esterilla abierta con incienso', desc: 'Incienso encendido. Creando la atmósfera de paz interior.' },
      { name: 'Rincón de meditación', desc: 'Cojín de zafu y plantas de bambú. Tu santuario de introspección.' },
      { name: 'Altar zen avanzado', desc: 'Campanas tibetanas, velas y luz tenue. Armonía espiritual total.' },
    ]
  },
  {
    key: 'personalizado',
    name: 'Personalizado',
    icon: Plus,
    iconColor: 'text-on-surface-variant/40',
    iconBg: 'bg-white/5 border border-white/10',
    themeProgressBg: 'bg-primary',
    themeText: 'text-primary',
    glowStyle: 'shadow-[0_0_25px_rgba(255,255,255,0.02)]',
    hasSprite: false,
    maxPhase: 4,
    typeLabel: 'Crecimiento Personal',
    phases: [
      { name: 'Objeto Fase 1', desc: 'Comienzo de un nuevo ciclo en tu habitación.' },
      { name: 'Objeto Fase 2', desc: 'Tu constancia está moldeando el entorno.' },
      { name: 'Objeto Fase 3', desc: 'La habitación refleja tu crecimiento.' },
      { name: 'Objeto Fase 4', desc: 'Representación máxima de tu consistencia.' },
    ]
  }
];

let cachedElements: ElementDef[] | null = null;

export function getRegisteredElements(): ElementDef[] {
  if (cachedElements) return cachedElements;

  // Process the glob results
  const foldersMap: Record<string, { maxPhase: number }> = {};

  Object.keys(pngFiles).forEach((key) => {
    // Key format contains /assets/elements/folderName/fase_X.png
    const match = key.match(/\/assets\/elements\/([^/]+)\/fase_(\d+)\.png$/);
    if (match) {
      const folder = match[1];
      // Ignorar folders temporales o vacíos conocidos (ej. 'Nueva carpeta')
      if (folder === 'Nueva carpeta') return;
      
      const phaseNum = parseInt(match[2], 10);
      if (!foldersMap[folder]) {
        foldersMap[folder] = { maxPhase: 0 };
      }
      if (phaseNum > foldersMap[folder].maxPhase) {
        foldersMap[folder].maxPhase = phaseNum;
      }
    }
  });

  const diskElements: ElementDef[] = Object.keys(foldersMap).map((folderName) => {
    const maxPhase = foldersMap[folderName].maxPhase;
    const known = KNOWN_ELEMENTS[folderName];

    // Capitalize name
    const displayName = known?.name || folderName
      .split(/[-_]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    let icon = Leaf;
    let iconColor = 'text-primary';
    const nameLower = folderName.toLowerCase();

    if (nameLower.includes('book') || nameLower.includes('libro') || nameLower.includes('read') || nameLower.includes('leer')) {
      icon = BookOpen;
      iconColor = 'text-[#accebf]';
    } else if (nameLower.includes('dumbbell') || nameLower.includes('mancuerna') || nameLower.includes('pesa') || nameLower.includes('exercise')) {
      icon = Dumbbell;
      iconColor = 'text-[#ebc246]';
    } else if (nameLower.includes('apple') || nameLower.includes('manzana') || nameLower.includes('fruit') || nameLower.includes('diet') || nameLower.includes('dieta') || nameLower.includes('comida')) {
      icon = Apple;
      iconColor = 'text-[#ff7675]';
    } else if (nameLower.includes('yoga') || nameLower.includes('esterilla') || nameLower.includes('medit') || nameLower.includes('zen')) {
      icon = Sparkles;
      iconColor = 'text-primary';
    }

    const phases = [];
    for (let i = 1; i <= 4; i++) {
      if (known?.phases && known.phases[i - 1]) {
        phases.push(known.phases[i - 1]);
      } else {
        phases.push({
          name: `${displayName} Fase ${i}`,
          desc: `Nivel ${i} de tu elemento ${displayName} en tu santuario.`
        });
      }
    }

    return {
      key: folderName,
      name: displayName,
      icon: known?.icon || icon,
      iconColor: known?.iconColor || iconColor,
      iconBg: known?.iconBg || 'bg-white/5 border border-white/10',
      themeProgressBg: known?.themeProgressBg || 'bg-primary',
      themeText: known?.themeText || 'text-primary',
      glowStyle: known?.glowStyle || 'shadow-[0_0_25px_rgba(255,255,255,0.02)]',
      hasSprite: true,
      spriteFolder: folderName,
      maxPhase,
      typeLabel: known?.typeLabel || 'Crecimiento Personal',
      phases
    };
  });

  cachedElements = [...diskElements, ...VIRTUAL_ELEMENTS];
  return cachedElements;
}

export function getElementDetails(nombreElemento: string, fase: number): ElementDef {
  const normInput = nombreElemento.toLowerCase();
  
  // Find a matching element definition
  const elements = getRegisteredElements();
  const matched = elements.find(el => {
    const keyLower = el.key.toLowerCase();
    const nameLower = el.name.toLowerCase();
    return normInput.includes(keyLower) || keyLower.includes(normInput) ||
           normInput.includes(nameLower) || nameLower.includes(normInput);
  });
  
  if (matched) {
    return matched;
  }
  
  // Hard fallback to Personalizado
  return {
    key: 'personalizado',
    name: nombreElemento || 'Personalizado',
    icon: Leaf,
    iconColor: 'text-[#accebf]',
    iconBg: 'bg-white/5 border border-white/10',
    themeProgressBg: 'bg-primary',
    themeText: 'text-primary',
    glowStyle: 'shadow-[0_0_25px_rgba(255,255,255,0.02)]',
    hasSprite: false,
    maxPhase: 4,
    typeLabel: 'Crecimiento Personal',
    phases: [
      { name: 'Objeto Fase 1', desc: 'Comienzo de un nuevo ciclo en tu habitación.' },
      { name: 'Objeto Fase 2', desc: 'Tu constancia está moldeando el entorno.' },
      { name: 'Objeto Fase 3', desc: 'La habitación refleja tu crecimiento.' },
      { name: 'Objeto Fase 4', desc: 'Representación máxima de tu consistencia.' },
    ]
  };
}

export function getSpritePath(nombreElemento: string, fase: number): string | null {
  const details = getElementDetails(nombreElemento, fase);
  if (!details.hasSprite || !details.spriteFolder) {
    return null;
  }
  const clampedPhase = Math.min(Math.max(fase, 1), details.maxPhase);
  const targetKey = `../assets/elements/${details.spriteFolder}/fase_${clampedPhase}.png`;
  return pngFiles[targetKey] || null;
}
