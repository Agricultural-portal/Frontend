import { useState, useEffect } from "react";
import { govSchemeService } from "@/services/govSchemeService";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Award, ArrowRight, Loader2, Calendar, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export function GovernmentSchemes() {
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedScheme, setSelectedScheme] = useState(null);

    useEffect(() => {
        fetchSchemes();
    }, []);

    const fetchSchemes = async () => {
        try {
            const data = await govSchemeService.getAllSchemes();
            setSchemes(data);
        } catch (error) {
            console.error("Failed to fetch schemes:", error);
            toast.error("Failed to load government schemes");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Government Schemes</h1>
                <p className="text-muted-foreground mt-1">View available government schemes for farmers</p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                </div>
            ) : schemes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {schemes.map((scheme) => (
                        <Card key={scheme.id} className="border-none shadow-sm hover:shadow-md transition-shadow flex flex-col h-full overflow-hidden">
                            <div className="relative">
                                {/* Status Badge */}
                                <div className="absolute top-4 right-4 z-10">
                                    <Badge variant={scheme.isActive ? "default" : "secondary"} className={scheme.isActive ? "bg-green-600 hover:bg-green-700" : "bg-slate-500"}>
                                        {scheme.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                            </div>

                            <CardContent className="p-6 flex-1 flex flex-col space-y-4">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                                        <Award className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800 line-clamp-2 leading-tight">{scheme.schemeName}</h3>
                                    </div>
                                </div>

                                <p className="text-muted-foreground text-sm line-clamp-3">
                                    {scheme.description}
                                </p>

                                {scheme.deadline && (
                                    <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg w-fit">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>Deadline: {new Date(scheme.deadline).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="p-6 pt-0 opacity-100 flex flex-col gap-3">
                                <Button
                                    variant="outline"
                                    className="w-full text-green-700 border-green-200 hover:bg-green-50 hover:text-green-800 hover:border-green-300"
                                    onClick={() => setSelectedScheme(scheme)}
                                >
                                    View Details
                                </Button>
                                {scheme.applicationLink && scheme.isActive && (
                                    <Button
                                        className="w-full gap-2"
                                        onClick={() => window.open(scheme.applicationLink, '_blank')}
                                    >
                                        Apply Now <ExternalLink className="w-4 h-4" />
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-dashed">
                    <p>No government schemes found at the moment.</p>
                </div>
            )}

            {/* Details Dialog */}
            <Dialog open={!!selectedScheme} onOpenChange={(open) => !open && setSelectedScheme(null)}>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="flex items-center justify-between gap-4 mb-4 pr-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                                    <Award className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <DialogTitle className="text-2xl font-bold text-slate-800">
                                        {selectedScheme?.schemeName}
                                    </DialogTitle>
                                    <Badge variant="outline" className="mt-2 text-xs font-normal">
                                        {selectedScheme?.isActive ? "Currently Active" : "Inactive"}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Description</h4>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-line text-sm">
                                {selectedScheme?.description}
                            </p>
                        </div>

                        {selectedScheme?.benefits && (
                            <div className="space-y-2">
                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Benefits</h4>
                                <p className="text-slate-600 leading-relaxed whitespace-pre-line text-sm bg-green-50/50 p-4 rounded-lg border border-green-100">
                                    {selectedScheme?.benefits}
                                </p>
                            </div>
                        )}

                        {selectedScheme?.deadline && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <span className="font-semibold">Application Deadline:</span>
                                <span>{new Date(selectedScheme.deadline).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <Button variant="outline" onClick={() => setSelectedScheme(null)}>Close</Button>
                        {selectedScheme?.applicationLink && selectedScheme?.isActive && (
                            <Button onClick={() => window.open(selectedScheme.applicationLink, '_blank')} className="gap-2">
                                Apply Online <ExternalLink className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
