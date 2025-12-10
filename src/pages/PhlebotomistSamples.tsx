import { useState } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { QrCode, TestTube, Save } from "lucide-react";

const PhlebotomistSamples = () => {
    const [sampleId, setSampleId] = useState("");

    // Mock State for the form
    const [formData, setFormData] = useState({
        patientName: "",
        testType: "",
        collectionSite: "",
        notes: ""
    });

    const handleScan = () => {
        // In a real app, this would open a camera or accept QR input
        setSampleId("SMP-" + Math.floor(Math.random() * 10000));
        toast.info("Mock QR Code Scanned!");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Sample Data Logged Successfully!");
        setFormData({ patientName: "", testType: "", collectionSite: "", notes: "" });
        setSampleId("");
    };

    return (
        <DashboardLayout role="phlebotomist">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Sample Collection</h1>
                <p className="text-muted-foreground">Log new samples and label them</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Entry Form */}
                <Card className="p-6 shadow-soft order-2 lg:order-1">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label>Sample ID / Barcode</Label>
                                <Button type="button" size="sm" variant="outline" onClick={handleScan}>
                                    <QrCode className="h-4 w-4 mr-2" />
                                    Scan QR
                                </Button>
                            </div>
                            <div className="flex gap-2">
                                <span className="flex items-center justify-center w-10 bg-muted rounded-md text-muted-foreground">
                                    <TestTube className="h-5 w-5" />
                                </span>
                                <Input
                                    placeholder="Scan or enter Sample ID"
                                    value={sampleId}
                                    onChange={(e) => setSampleId(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Patient Name</Label>
                            <Input
                                placeholder="Enter patient name"
                                value={formData.patientName}
                                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Test Type</Label>
                                <Select onValueChange={(v) => setFormData({ ...formData, testType: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="blood">Blood</SelectItem>
                                        <SelectItem value="urine">Urine</SelectItem>
                                        <SelectItem value="swab">Swab</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Collection Site</Label>
                                <Input
                                    placeholder="e.g. Left Arm"
                                    value={formData.collectionSite}
                                    onChange={(e) => setFormData({ ...formData, collectionSite: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Notes (Optional)</Label>
                            <Input
                                placeholder="Any difficulty or remarks..."
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>

                        <Button type="submit" className="w-full gap-2">
                            <Save className="h-4 w-4" />
                            Log Sample
                        </Button>
                    </form>
                </Card>

                {/* Instructions / Info */}
                <Card className="p-6 shadow-soft bg-primary/5 border-primary/20 order-1 lg:order-2 h-fit">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <TestTube className="h-5 w-5 text-primary" />
                        Collection Guidelines
                    </h3>
                    <ul className="space-y-3 text-sm text-foreground/80">
                        <li className="flex gap-2">
                            <span className="font-bold text-primary">1.</span>
                            Verify patient identity using ID card.
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold text-primary">2.</span>
                            Ensure all tubes are labelled immediately after collection.
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold text-primary">3.</span>
                            Keep samples at appropriate temperature during transport.
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold text-primary">4.</span>
                            Scan the barcode to link the physical tube to the digital record.
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold text-primary">5.</span>
                            Mark appointment as "Completed" after successful collection.
                        </li>
                    </ul>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default PhlebotomistSamples;
