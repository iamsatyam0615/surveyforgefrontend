'use client';

import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { PRESET_THEMES, GOOGLE_FONTS, Theme } from '@/themes/presets';
import { getButtonStyle, getBackgroundStyle } from '@/lib/themeUtils';

interface ThemePanelProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export default function ThemePanel({ theme, onThemeChange }: ThemePanelProps) {
  const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null);

  const applyPreset = (presetKey: string) => {
    onThemeChange(PRESET_THEMES[presetKey]);
  };

  const updateThemeField = (field: keyof Theme, value: any) => {
    onThemeChange({ ...theme, [field]: value });
  };

  const copyTailwindConfig = () => {
    const config = `
// Tailwind Theme Config
theme: {
  primary: '${theme.primary}',
  background: '${theme.background}',
  accent: '${theme.accent}',
  borderRadius: '${theme.rounded}',
  fontFamily: '${theme.font}',
}
    `.trim();
    
    navigator.clipboard.writeText(config);
    alert('Tailwind config copied to clipboard!');
  };

  return (
    <div className="h-full overflow-y-auto bg-white p-0">
      <div className="border-b border-gray-200 px-5 py-3">
        <h2 className="text-sm font-semibold text-gray-800">Theme & Branding</h2>
        <p className="text-xs text-gray-500">Quick presets and custom colors</p>
      </div>
      <div className="p-5">

      {/* Preset Themes */}
      <div className="mb-6">
        <h3 className="text-xs font-medium text-gray-600 mb-2">Quick Themes</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(PRESET_THEMES).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => applyPreset(key)}
              className="p-3 rounded-md border hover:border-blue-500 transition-all text-left group"
              style={{
                background: preset.gradient && preset.gradientFrom && preset.gradientTo
                  ? `linear-gradient(135deg, ${preset.gradientFrom}, ${preset.gradientTo})`
                  : preset.background,
              }}
            >
              <div className="font-medium text-xs mb-1" style={{ color: preset.text }}>
                {preset.name}
              </div>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.primary }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.accent }} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Color Pickers */}
      <div className="mb-6 space-y-4">
        <h3 className="text-xs font-medium text-gray-600 mb-2">Custom Colors</h3>

        {/* Primary Color */}
        <div>
          <label className="block text-xs font-medium mb-1 text-gray-700">Primary Color</label>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-300"
              style={{ backgroundColor: theme.primary }}
              onClick={() => setActiveColorPicker(activeColorPicker === 'primary' ? null : 'primary')}
            />
            <input
              type="text"
              value={theme.primary}
              onChange={(e) => updateThemeField('primary', e.target.value)}
              className="flex-1 px-3 py-2 border rounded text-gray-900 bg-white"
            />
          </div>
          {activeColorPicker === 'primary' && (
            <div className="mt-2">
              <HexColorPicker color={theme.primary} onChange={(c) => updateThemeField('primary', c)} />
            </div>
          )}
        </div>

        {/* Background Color */}
        <div>
          <label className="block text-xs font-medium mb-1 text-gray-700">Background Color</label>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-300"
              style={{ backgroundColor: theme.background }}
              onClick={() => setActiveColorPicker(activeColorPicker === 'background' ? null : 'background')}
            />
            <input
              type="text"
              value={theme.background}
              onChange={(e) => updateThemeField('background', e.target.value)}
              className="flex-1 px-3 py-2 border rounded text-gray-900 bg-white"
            />
          </div>
          {activeColorPicker === 'background' && (
            <div className="mt-2">
              <HexColorPicker color={theme.background} onChange={(c) => updateThemeField('background', c)} />
            </div>
          )}
        </div>

        {/* Accent Color */}
        <div>
          <label className="block text-xs font-medium mb-1 text-gray-700">Accent Color</label>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-300"
              style={{ backgroundColor: theme.accent }}
              onClick={() => setActiveColorPicker(activeColorPicker === 'accent' ? null : 'accent')}
            />
            <input
              type="text"
              value={theme.accent}
              onChange={(e) => updateThemeField('accent', e.target.value)}
              className="flex-1 px-3 py-2 border rounded text-gray-900 bg-white"
            />
          </div>
          {activeColorPicker === 'accent' && (
            <div className="mt-2">
              <HexColorPicker color={theme.accent} onChange={(c) => updateThemeField('accent', c)} />
            </div>
          )}
        </div>

        {/* Text Color */}
        <div>
          <label className="block text-xs font-medium mb-1 text-gray-700">Text Color</label>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-300"
              style={{ backgroundColor: theme.text }}
              onClick={() => setActiveColorPicker(activeColorPicker === 'text' ? null : 'text')}
            />
            <input
              type="text"
              value={theme.text}
              onChange={(e) => updateThemeField('text', e.target.value)}
              className="flex-1 px-3 py-2 border rounded text-gray-900 bg-white"
            />
          </div>
          {activeColorPicker === 'text' && (
            <div className="mt-2">
              <HexColorPicker color={theme.text} onChange={(c) => updateThemeField('text', c)} />
            </div>
          )}
        </div>
      </div>

      {/* Gradient Toggle */}
      <div className="mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={theme.gradient}
            onChange={(e) => {
              updateThemeField('gradient', e.target.checked);
              if (e.target.checked && !theme.gradientFrom) {
                updateThemeField('gradientFrom', theme.primary);
                updateThemeField('gradientTo', theme.accent);
              }
            }}
            className="w-5 h-5"
          />
          <span className="text-sm font-medium text-gray-700">Enable Gradient Background</span>
        </label>

        {theme.gradient && (
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Gradient From</label>
              <input
                type="text"
                value={theme.gradientFrom || ''}
                onChange={(e) => updateThemeField('gradientFrom', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-gray-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Gradient To</label>
              <input
                type="text"
                value={theme.gradientTo || ''}
                onChange={(e) => updateThemeField('gradientTo', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-gray-900 bg-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* Font Family */}
      <div className="mb-6">
        <label className="block text-xs font-medium mb-1 text-gray-700">Font Family</label>
        <select
          value={theme.font}
          onChange={(e) => updateThemeField('font', e.target.value)}
          className="w-full px-3 py-2 border rounded text-gray-900 bg-white"
        >
          {GOOGLE_FONTS.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
      </div>

      {/* Border Radius */}
      <div className="mb-6">
        <label className="block text-xs font-medium mb-1 text-gray-700">Border Radius</label>
        <select
          value={theme.rounded}
          onChange={(e) => updateThemeField('rounded', e.target.value)}
          className="w-full px-3 py-2 border rounded text-gray-900 bg-white"
        >
          <option value="rounded-none">None</option>
          <option value="rounded-sm">Small</option>
          <option value="rounded-md">Medium</option>
          <option value="rounded-lg">Large</option>
          <option value="rounded-xl">Extra Large</option>
          <option value="rounded-2xl">2X Large</option>
          <option value="rounded-3xl">3X Large</option>
          <option value="rounded-full">Full</option>
        </select>
      </div>

      {/* Button Style */}
      <div className="mb-6">
        <label className="block text-xs font-medium mb-1 text-gray-700">Button Style</label>
        <div className="space-y-2">
          {['filled', 'outline', 'soft'].map((style) => (
            <label key={style} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={theme.buttonStyle === style}
                onChange={() => updateThemeField('buttonStyle', style)}
                className="w-4 h-4"
              />
              <span className="capitalize text-gray-700">{style}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Background Pattern */}
      <div className="mb-6">
        <label className="block text-xs font-medium mb-1 text-gray-700">Background Pattern</label>
        <div className="space-y-2">
          {['none', 'dots', 'waves'].map((pattern) => (
            <label key={pattern} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={theme.pattern === pattern}
                onChange={() => updateThemeField('pattern', pattern)}
                className="w-4 h-4"
              />
              <span className="capitalize text-gray-700">{pattern}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Export Button */}
      <button
        onClick={copyTailwindConfig}
        className="w-full bg-gray-900 text-white py-2.5 rounded font-medium hover:bg-gray-800 transition-colors"
      >
        📋 Copy Tailwind Config
      </button>
      </div>
    </div>
  );
}
