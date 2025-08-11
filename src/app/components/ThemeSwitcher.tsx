"use client"
import React, { useEffect, useState } from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const ThemeSwitcher = () => {
    const {theme, setTheme} = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if(!mounted) {
        return null;
    }

  return (
    <Tabs defaultValue={theme}>
        <TabsList className="border">
            <TabsTrigger value="light" onClick={() => setTheme("light")}>
                <Sun className='h-4 w-4'/>
            </TabsTrigger>
            <TabsTrigger value="dark" onClick={() => setTheme("dark")}>
                <Moon className='h-4 w-4'/>
            </TabsTrigger>
            <TabsTrigger value="system" onClick={() => setTheme("system")}>
                <Monitor className='h-4 w-4'/>
            </TabsTrigger>
        </TabsList>
    </Tabs>
  )
}

export default ThemeSwitcher