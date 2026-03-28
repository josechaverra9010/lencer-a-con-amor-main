import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    Tag,
    AlertCircle,
    Check,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from "@/services/apiService";

const AdminCategories = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [categoryName, setCategoryName] = useState("");

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast({
                title: "Error",
                description: "No se pudieron cargar las categorías.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const openCreateDialog = () => {
        setEditingCategory(null);
        setCategoryName("");
        setIsDialogOpen(true);
    };

    const openEditDialog = (category: any) => {
        setEditingCategory(category);
        setCategoryName(category.name);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Estás seguro de que deseas eliminar esta categoría? Solo podrás hacerlo si no tiene productos asociados.")) return;
        try {
            await deleteCategory(id);
            toast({ title: "Éxito", description: "Categoría eliminada correctamente." });
            fetchCategories();
        } catch (error: any) {
            const message = error.response?.data?.detail || "No se pudo eliminar la categoría.";
            toast({ title: "Error", description: message, variant: "destructive" });
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!categoryName.trim()) {
            toast({ title: "Cuidado", description: "El nombre de la categoría es obligatorio.", variant: "destructive" });
            return;
        }

        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, { name: categoryName });
                toast({ title: "Éxito", description: "Categoría actualizada correctamente." });
            } else {
                await createCategory({ name: categoryName });
                toast({ title: "Éxito", description: "Categoría creada correctamente." });
            }
            setIsDialogOpen(false);
            fetchCategories();
        } catch (error) {
            console.error("Error saving category:", error);
            toast({
                title: "Error",
                description: "No se pudo guardar la categoría.",
                variant: "destructive"
            });
        }
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="space-y-8 animate-fadeIn">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-serif font-semibold text-foreground">Categorías</h1>
                        <p className="text-muted-foreground mt-1">Administra las categorías de productos.</p>
                    </div>
                    <Button
                        onClick={openCreateDialog}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                    >
                        <Plus size={18} />
                        Nueva Categoría
                    </Button>
                </div>

                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-border bg-muted/20">
                        <div className="relative max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <Input
                                placeholder="Buscar categoría..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-muted/30">
                                    <th className="p-4 font-medium text-muted-foreground border-b border-border">Nombre</th>
                                    <th className="p-4 font-medium text-muted-foreground border-b border-border">ID</th>
                                    <th className="p-4 font-medium text-muted-foreground border-b border-border text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={3} className="p-8 text-center text-muted-foreground italic">Cargando categorías...</td>
                                    </tr>
                                ) : filteredCategories.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="p-8 text-center text-muted-foreground italic">No se encontraron categorías.</td>
                                    </tr>
                                ) : (
                                    filteredCategories.map((category) => (
                                        <tr key={category.id} className="hover:bg-muted/10 transition-colors">
                                            <td className="p-4 border-b border-border font-medium flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                    <Tag size={16} />
                                                </div>
                                                {category.name}
                                            </td>
                                            <td className="p-4 border-b border-border text-muted-foreground text-sm">#{category.id}</td>
                                            <td className="p-4 border-b border-border text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button 
                                                        size="icon" 
                                                        variant="ghost" 
                                                        onClick={() => openEditDialog(category)}
                                                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                    >
                                                        <Pencil size={16} />
                                                    </Button>
                                                    <Button 
                                                        size="icon" 
                                                        variant="ghost" 
                                                        onClick={() => handleDelete(category.id)}
                                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="font-serif text-2xl">
                                {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSave} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="category-name">Nombre de la Categoría</Label>
                                <Input 
                                    id="category-name" 
                                    value={categoryName} 
                                    onChange={(e) => setCategoryName(e.target.value)} 
                                    placeholder="Ej: Conjuntos, Bralettes..."
                                    required 
                                />
                            </div>
                            <DialogFooter className="pt-4">
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                                <Button type="submit" className="bg-primary text-primary-foreground">
                                    {editingCategory ? "Actualizar" : "Crear"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
};

export default AdminCategories;
