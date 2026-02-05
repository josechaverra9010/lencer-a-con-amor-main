import { useState, useEffect, useRef } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    MoreVertical,
    Package,
    Image as ImageIcon,
    AlertCircle,
    X,
    Check,
    ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
    getProducts,
    updateProduct,
    deleteProduct,
    createProduct,
    getCategories,
    getColors,
    uploadFile
} from "@/services/apiService";

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "32B", "34B", "36B", "38B", "Única"];

const AdminProducts = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [allColors, setAllColors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        original_price: null as number | null,
        category_id: 0,
        images: [""] as string[],
        sizes: [] as string[],
        color_ids: [] as number[],
        is_new: false,
        is_sale: false,
        features: [""] as string[]
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [productsData, categoriesData, colorsData] = await Promise.all([
                getProducts(),
                getCategories(),
                getColors()
            ]);
            setProducts(productsData);
            setCategories(categoriesData);
            setAllColors(colorsData);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast({
                title: "Error",
                description: "No se pudieron cargar los datos.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openCreateDialog = () => {
        setEditingProduct(null);
        setFormData({
            name: "",
            description: "",
            price: 0,
            original_price: null,
            category_id: categories.length > 0 ? categories[0].id : 0,
            images: [""],
            sizes: [],
            color_ids: [],
            is_new: true,
            is_sale: false,
            features: [""]
        });
        setIsDialogOpen(true);
    };

    const openEditDialog = (product: any) => {
        setEditingProduct(product);
        // Find category ID by name if needed, but our backend Product should have category object
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            original_price: product.originalPrice || null,
            category_id: product.category_id || 0,
            images: [...product.images],
            sizes: [...product.sizes],
            color_ids: product.colors.map((c: any) => c.id),
            is_new: !!product.isNew,
            is_sale: !!product.isSale,
            features: [...(product.features || [""])]
        });
        setIsDialogOpen(true);
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const result = await uploadFile(file);
            const newUrl = result.url;

            // Add to images array (filter out first empty one if exists)
            const currentImages = formData.images.filter(img => img.trim() !== "");
            setFormData(prev => ({
                ...prev,
                images: [...currentImages, newUrl]
            }));

            toast({
                title: "Éxito",
                description: "Imagen subida correctamente.",
            });
        } catch (error) {
            console.error("Error uploading file:", error);
            toast({
                title: "Error",
                description: "No se pudo subir la imagen.",
                variant: "destructive",
            });
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleArrayChange = (field: 'images' | 'features', index: number, value: string) => {
        const newArr = [...formData[field]];
        newArr[index] = value;
        setFormData(prev => ({ ...prev, [field]: newArr }));
    };

    const addArrayItem = (field: 'images' | 'features') => {
        setFormData(prev => ({ ...prev, [field]: [...prev[field], ""] }));
    };

    const removeArrayItem = (field: 'images' | 'features', index: number) => {
        if (formData[field].length <= 1) return;
        const newArr = formData[field].filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, [field]: newArr }));
    };

    const toggleSize = (size: string) => {
        const newSizes = formData.sizes.includes(size)
            ? formData.sizes.filter(s => s !== size)
            : [...formData.sizes, size];
        setFormData(prev => ({ ...prev, sizes: newSizes }));
    };

    const toggleColor = (colorId: number) => {
        const newColors = formData.color_ids.includes(colorId)
            ? formData.color_ids.filter(id => id !== colorId)
            : [...formData.color_ids, colorId];
        setFormData(prev => ({ ...prev, color_ids: newColors }));
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) return;
        try {
            await deleteProduct(id);
            toast({ title: "Éxito", description: "Producto eliminado correctamente." });
            fetchData();
        } catch (error) {
            toast({ title: "Error", description: "No se pudo eliminar el producto.", variant: "destructive" });
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.category_id || formData.price <= 0) {
            toast({ title: "Cuidado", description: "Por favor completa los campos obligatorios.", variant: "destructive" });
            return;
        }

        // Clean up empty items
        const submitData = {
            ...formData,
            images: formData.images.filter(img => img.trim() !== ""),
            features: formData.features.filter(f => f.trim() !== "")
        };

        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, submitData);
                toast({ title: "Éxito", description: "Producto actualizado correctamente." });
            } else {
                await createProduct(submitData);
                toast({ title: "Éxito", description: "Producto creado correctamente." });
            }
            setIsDialogOpen(false);
            fetchData();
        } catch (error) {
            console.error("Error saving product:", error);
            toast({
                title: "Error",
                description: "No se pudo guardar el producto. Revisa la consola para más detalles.",
                variant: "destructive"
            });
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="space-y-8 animate-fadeIn">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-serif font-semibold text-foreground">Productos</h1>
                        <p className="text-muted-foreground mt-1">Administra el catálogo de lencería.</p>
                    </div>
                    <Button
                        onClick={openCreateDialog}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                    >
                        <Plus size={18} />
                        Nuevo Producto
                    </Button>
                </div>

                {/* Product List */}
                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-border bg-muted/20">
                        <div className="relative max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <Input
                                placeholder="Buscar por nombre..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                        {loading ? (
                            <div className="col-span-full py-20 text-center text-muted-foreground italic">Cargando catálogo...</div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="col-span-full py-20 text-center text-muted-foreground italic">No se encontraron productos.</div>
                        ) : (
                            filteredProducts.map((product) => (
                                <div key={product.id} className="group relative bg-background border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                                    <div className="aspect-[3/4] overflow-hidden bg-muted relative">
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-2 right-2 flex gap-1">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-md bg-white/80 backdrop-blur-sm">
                                                        <MoreVertical size={14} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-32">
                                                    <DropdownMenuItem className="gap-2" onClick={() => openEditDialog(product)}>
                                                        <Pencil size={14} /> Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDelete(product.id)}>
                                                        <Trash2 size={14} /> Eliminar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="text-[10px] uppercase tracking-wider text-primary font-bold">
                                                {typeof product.category === 'object' ? product.category.name : product.category}
                                            </p>
                                            <p className="font-bold text-foreground text-sm">
                                                ${product.price.toLocaleString('es-CO')}
                                            </p>
                                        </div>
                                        <h3 className="font-medium text-foreground truncate mb-2 text-sm">{product.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <div className="flex -space-x-1">
                                                {product.colors.slice(0, 3).map((c: any) => (
                                                    <div key={c.id} className="w-3.5 h-3.5 rounded-full border border-background shadow-sm" style={{ backgroundColor: c.value }} title={c.name} />
                                                ))}
                                            </div>
                                            <span className="text-[10px] text-muted-foreground">
                                                {product.sizes.slice(0, 2).join(', ')}{product.sizes.length > 2 ? '...' : ''}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Product Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="font-serif text-2xl">{editingProduct ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSave} className="space-y-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Info */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nombre <span className="text-destructive">*</span></Label>
                                        <Input id="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} required />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="category">Categoría <span className="text-destructive">*</span></Label>
                                        <Select
                                            value={formData.category_id.toString()}
                                            onValueChange={(val) => handleInputChange('category_id', parseInt(val))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona una categoría" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="price">Precio (COP) <span className="text-destructive">*</span></Label>
                                            <Input id="price" type="number" value={formData.price} onChange={(e) => handleInputChange('price', parseFloat(e.target.value))} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="original_price">Precio Original</Label>
                                            <Input id="original_price" type="number" value={formData.original_price || ""} onChange={(e) => handleInputChange('original_price', e.target.value ? parseFloat(e.target.value) : null)} />
                                        </div>
                                    </div>

                                    <div className="flex gap-6">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="is_new" checked={formData.is_new} onCheckedChange={(val) => handleInputChange('is_new', !!val)} />
                                            <Label htmlFor="is_new" className="text-sm font-normal">Es Novedad</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="is_sale" checked={formData.is_sale} onCheckedChange={(val) => handleInputChange('is_sale', !!val)} />
                                            <Label htmlFor="is_sale" className="text-sm font-normal">En Oferta</Label>
                                        </div>
                                    </div>
                                </div>

                                {/* Description & URLs */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="desc">Descripción</Label>
                                        <textarea
                                            id="desc"
                                            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                            value={formData.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                        />
                                    </div>

                                    {/* Images */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <Label>Imágenes</Label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleFileUpload}
                                                    className="hidden"
                                                    accept="image/*"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="h-7 text-xs gap-1"
                                                    disabled={uploading}
                                                >
                                                    <Plus size={12} /> {uploading ? "Subiendo..." : "Subir Archivo"}
                                                </Button>
                                                <Button type="button" variant="ghost" size="sm" onClick={() => addArrayItem('images')} className="h-7 text-xs">
                                                    + URL
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2">
                                            {formData.images.map((url, idx) => (
                                                <div key={idx} className="flex gap-2">
                                                    <Input value={url} onChange={(e) => handleArrayChange('images', idx, e.target.value)} placeholder="https://..." className="h-8 text-xs" />
                                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayItem('images', idx)} className="h-8 w-8 text-destructive">
                                                        <X size={14} />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-border" />

                            {/* Options & Features */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Sizes & Colors */}
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Tallas Disponibles</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {ALL_SIZES.map(size => (
                                                <button
                                                    key={size}
                                                    type="button"
                                                    onClick={() => toggleSize(size)}
                                                    className={`px-2 py-1 rounded border text-[10px] font-medium transition-colors ${formData.sizes.includes(size)
                                                        ? "bg-primary text-primary-foreground border-primary"
                                                        : "bg-background text-muted-foreground border-border hover:border-primary/50"
                                                        }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Colores</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {allColors.map(color => (
                                                <button
                                                    key={color.id}
                                                    type="button"
                                                    onClick={() => toggleColor(color.id)}
                                                    className={`p-1 rounded-full border-2 transition-all ${formData.color_ids.includes(color.id)
                                                        ? "border-primary scale-110 shadow-md"
                                                        : "border-transparent opacity-60 hover:opacity-100"
                                                        }`}
                                                    title={color.name}
                                                >
                                                    <div className="w-5 h-5 rounded-full" style={{ backgroundColor: color.value }} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Características / Detalles</Label>
                                        <Button type="button" variant="ghost" size="sm" onClick={() => addArrayItem('features')} className="h-7 text-xs">
                                            + Añadir
                                        </Button>
                                    </div>
                                    <div className="space-y-2 max-h-[180px] overflow-y-auto pr-2">
                                        {formData.features.map((feat, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <Input value={feat} onChange={(e) => handleArrayChange('features', idx, e.target.value)} placeholder="Ej: Encaje suave premium" className="h-8 text-xs" />
                                                <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayItem('features', idx)} className="h-8 w-8 text-destructive">
                                                    <X size={14} />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t border-border mt-4">
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                                <Button type="submit" className="bg-primary text-primary-foreground">
                                    {editingProduct ? "Actualizar Producto" : "Crear Producto"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
};

export default AdminProducts;
