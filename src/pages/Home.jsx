import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Users, ShoppingCart, ShieldCheck, TrendingUp, Award } from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center space-y-6 mb-16">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center shadow-xl">
                            <Leaf className="w-12 h-12 text-white" />
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
                        Welcome to <span className="text-green-600">FarmLink</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        A comprehensive agricultural management platform connecting farmers, buyers, and administrators for a smarter farming ecosystem.
                    </p>
                    <div className="flex gap-4 justify-center mt-8">
                        <Link to="/login">
                            <Button size="lg" className="text-lg px-8 py-6">
                                Get Started
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                                Register Now
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Features Section */}
                <div className="grid md:grid-cols-3 gap-8 mt-20">
                    {/* Farmer Card */}
                    <Card className="hover:shadow-xl transition-shadow border-2 hover:border-green-500">
                        <CardHeader>
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                                <Users className="w-6 h-6 text-green-600 dark:text-green-300" />
                            </div>
                            <CardTitle className="text-2xl">For Farmers</CardTitle>
                            <CardDescription>Manage your farm operations efficiently</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-start gap-2">
                                <TrendingUp className="w-5 h-5 text-green-600 mt-1" />
                                <p className="text-sm">Track crop cycles and manage tasks</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <Award className="w-5 h-5 text-green-600 mt-1" />
                                <p className="text-sm">Access government schemes and subsidies</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <ShoppingCart className="w-5 h-5 text-green-600 mt-1" />
                                <p className="text-sm">Sell products directly to buyers</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <TrendingUp className="w-5 h-5 text-green-600 mt-1" />
                                <p className="text-sm">Monitor finances and weather alerts</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Buyer Card */}
                    <Card className="hover:shadow-xl transition-shadow border-2 hover:border-blue-500">
                        <CardHeader>
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                                <ShoppingCart className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                            </div>
                            <CardTitle className="text-2xl">For Buyers</CardTitle>
                            <CardDescription>Source fresh produce directly from farms</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-start gap-2">
                                <ShoppingCart className="w-5 h-5 text-blue-600 mt-1" />
                                <p className="text-sm">Browse and order quality products</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <Users className="w-5 h-5 text-blue-600 mt-1" />
                                <p className="text-sm">Connect directly with farmers</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <Award className="w-5 h-5 text-blue-600 mt-1" />
                                <p className="text-sm">Rate and review transactions</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <TrendingUp className="w-5 h-5 text-blue-600 mt-1" />
                                <p className="text-sm">Track orders in real-time</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Admin Card */}
                    <Card className="hover:shadow-xl transition-shadow border-2 hover:border-purple-500">
                        <CardHeader>
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                                <ShieldCheck className="w-6 h-6 text-purple-600 dark:text-purple-300" />
                            </div>
                            <CardTitle className="text-2xl">For Admins</CardTitle>
                            <CardDescription>Oversee and manage the platform</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-start gap-2">
                                <Users className="w-5 h-5 text-purple-600 mt-1" />
                                <p className="text-sm">Manage farmers and buyers</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <Award className="w-5 h-5 text-purple-600 mt-1" />
                                <p className="text-sm">Add and manage government schemes</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <TrendingUp className="w-5 h-5 text-purple-600 mt-1" />
                                <p className="text-sm">Monitor platform analytics</p>
                            </div>
                            <div className="flex items-start gap-2">
                                <ShieldCheck className="w-5 h-5 text-purple-600 mt-1" />
                                <p className="text-sm">Oversee all orders and transactions</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Call to Action */}
                <div className="text-center mt-20 space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        Ready to Transform Your Agricultural Journey?
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Join thousands of farmers, buyers, and administrators who are already using FarmLink to streamline their agricultural operations.
                    </p>
                    <Link to="/login">
                        <Button size="lg" className="text-lg px-12 py-6 mt-6">
                            Start Now
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t mt-20 py-8">
                <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
                    <p>© 2025 FarmLink. All rights reserved.</p>
                    <p className="mt-2">Smart Farming Management System</p>
                </div>
            </footer>
        </div>
    );
}
