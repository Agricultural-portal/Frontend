"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Sun, Cloud, CloudRain, CloudLightning, Wind, Droplets, Thermometer } from "lucide-react";

const forecast = [
  { day: "Monday", temp: "32°C", condition: "Sunny", icon: Sun },
  { day: "Tuesday", temp: "30°C", condition: "Cloudy", icon: Cloud },
  { day: "Wednesday", temp: "28°C", condition: "Rainy", icon: CloudRain },
  { day: "Thursday", temp: "29°C", condition: "Showers", icon: CloudRain },
  { day: "Friday", temp: "31°C", condition: "Sunny", icon: Sun },
];

export function Weather() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Weather</h1>
        <p className="text-muted-foreground">Local weather and agricultural forecasts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-none shadow-sm overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-8">
            <div className="flex justify-between items-start">
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold">Punjab, India</h2>
                  <p className="opacity-80">Monday, Jan 20, 2025</p>
                </div>
                <div className="flex items-center gap-4">
                  <Sun className="w-16 h-16 text-yellow-300" />
                  <span className="text-6xl font-bold">32°C</span>
                </div>
                <p className="text-xl">Mostly Sunny</p>
              </div>
              <Badge className="bg-white/20 text-white border-none backdrop-blur-md">Current Weather</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader><CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Current Details</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3"><Droplets className="w-5 h-5 text-blue-500" /><span className="text-sm">Humidity</span></div>
              <span className="font-bold">45%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3"><Wind className="w-5 h-5 text-blue-500" /><span className="text-sm">Wind Speed</span></div>
              <span className="font-bold">12 km/h</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3"><CloudLightning className="w-5 h-5 text-blue-500" /><span className="text-sm">Rain Chance</span></div>
              <span className="font-bold">5%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <h3 className="text-xl font-bold pt-4">5-Day Forecast</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {forecast.map((f, i) => (
          <Card key={i} className="border-none shadow-sm text-center">
            <CardContent className="p-6 space-y-3">
              <p className="text-sm font-bold">{f.day}</p>
              <f.icon className="w-8 h-8 mx-auto text-blue-500" />
              <p className="text-xl font-bold">{f.temp}</p>
              <p className="text-xs text-muted-foreground">{f.condition}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
