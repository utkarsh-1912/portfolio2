'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { Badge } from './badge';

interface TagInputProps {
    value: string[];
    onChange: (tags: string[]) => void;
    suggestions?: string[];
    placeholder?: string;
}

export function TagInput({ value = [], onChange, suggestions = [], placeholder = 'Add tag...' }: TagInputProps) {
    const [inputValue, setInputValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Filter suggestions based on input value
    const filteredSuggestions = suggestions.filter(
        (s) => s.toLowerCase().includes(inputValue.toLowerCase()) && !value.includes(s)
    );

    // Check if exact match exists
    const exactMatch = suggestions.find(s => s.toLowerCase() === inputValue.toLowerCase()) || value.find(s => s.toLowerCase() === inputValue.toLowerCase());
    const showCreate = inputValue.trim().length > 0 && !exactMatch;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const addTag = (tag: string) => {
        const trimmed = tag.trim();
        if (trimmed && !value.includes(trimmed)) {
            onChange([...value, trimmed]);
        }
        setInputValue('');
        setIsOpen(false);
    };

    const removeTag = (tagToRemove: string) => {
        onChange(value.filter((tag) => tag !== tagToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (inputValue.trim()) {
                addTag(inputValue);
            }
        } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
            removeTag(value[value.length - 1]);
        }
    };

    return (
        <div className="relative" ref={containerRef}>
            <div 
                className="flex flex-wrap gap-2 p-2 min-h-[44px] rounded-xl border border-input bg-background focus-within:border-foreground/40 focus-within:ring-4 focus-within:ring-foreground/5 cursor-text transition-colors"
                onClick={() => setIsOpen(true)}
            >
                {value.map((tag) => (
                    <Badge 
                        key={tag} 
                        variant="secondary" 
                        className="flex items-center gap-1 rounded-full border-transparent bg-muted pl-2.5 pr-1 font-normal text-foreground"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeTag(tag);
                            }}
                            className="hover:bg-muted p-0.5 transition-colors"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        setIsOpen(true);
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsOpen(true)}
                    className="flex-1 bg-transparent outline-none min-w-[120px] text-sm text-foreground placeholder:text-muted-foreground/50"
                    placeholder={value.length === 0 ? placeholder : ''}
                />
            </div>

            {/* Dropdown */}
            {isOpen && (filteredSuggestions.length > 0 || showCreate) && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto bg-card border border-border shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                    <ul className="py-1 text-sm text-foreground">
                        {showCreate && (
                            <li
                                className="px-3 py-2 hover:bg-muted hover:text-primary cursor-pointer flex items-center gap-2 border-b border-border font-bold"
                                onClick={() => addTag(inputValue)}
                            >
                                <Plus className="h-4 w-4" /> Create "{inputValue}"
                            </li>
                        )}
                        {filteredSuggestions.map((suggestion) => (
                            <li
                                key={suggestion}
                                className="px-3 py-2 hover:bg-muted hover:text-primary cursor-pointer transition-colors"
                                onClick={() => addTag(suggestion)}
                            >
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
