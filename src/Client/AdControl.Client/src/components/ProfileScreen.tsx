import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "./ui/card.tsx";
import {Label} from "./ui/label.tsx";
import {Input} from "./ui/input.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "./ui/select.tsx";
import {Switch} from "./ui/switch.tsx";
import {Separator} from "./ui/separator.tsx";
import {Button} from "./ui/button.tsx";

export const ProfileScreen = () => {
    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1>Личная информация</h1>
                <p className="text-gray-600 mt-1">Configure system preferences and integrations</p>
            </div>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Имя</CardTitle>
                    <CardDescription>Basic system configuration and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="company-name">Пароль</Label>
                        <Input id="company-name" defaultValue="AdScreen Control" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="timezone">Time Zone</Label>
                        <Select defaultValue="utc-5">
                            <SelectTrigger id="timezone">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                                <SelectItem value="utc-7">Mountain Time (UTC-7)</SelectItem>
                                <SelectItem value="utc-6">Central Time (UTC-6)</SelectItem>
                                <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select defaultValue="en">
                            <SelectTrigger id="language">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="es">Spanish</SelectItem>
                                <SelectItem value="fr">French</SelectItem>
                                <SelectItem value="de">German</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button style={{ backgroundColor: "#2563EB" }}>Save Changes</Button>
            </div>
        </div>
    )
}
