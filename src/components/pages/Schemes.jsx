"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ExternalLink, Award, Calendar, CheckCircle2 } from "lucide-react";
import { mockSchemes } from "@/lib/mockData";

export function Schemes() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Government Schemes</h1>
          <p className="text-muted-foreground">Available subsidies and support programs for you</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockSchemes.map((scheme) => (
          <Card key={scheme.id} className="border-none shadow-sm flex flex-col h-full overflow-hidden">
            <CardHeader className="bg-primary/5 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <Badge variant={scheme.status === "Open" ? "default" : "secondary"}>
                  {scheme.status}
                </Badge>
              </div>
              <CardTitle className="mt-4 text-lg font-bold leading-tight">
                {scheme.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 py-6 flex flex-col justify-between">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {scheme.description}
                </p>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider">Eligibility</p>
                  <ul className="space-y-1">
                    {scheme.eligibility.slice(0, 2).map((item, i) => (
                      <li key={i} className="text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-chart-1" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>Deadline: {scheme.deadline}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border/50">
                <Button className="w-full gap-2 shadow-md">
                  View Details
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
