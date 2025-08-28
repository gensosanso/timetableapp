"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, BookOpen } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Subject {
  id: string;
  name: string;
  color: string;
  description?: string;
}

const PREDEFINED_COLORS = [
  "#4f46e5", // Indigo
  "#dc2626", // Red
  "#059669", // Emerald
  "#d97706", // Amber
  "#7c3aed", // Violet
  "#0891b2", // Cyan
  "#be185d", // Pink
  "#65a30d", // Lime
  "#ea580c", // Orange
  "#1f2937", // Gray
];

export default function MatierePage() {
  const [subjects, setSubjects] = useState<Subject[]>([
    {
      id: "1",
      name: "Mathématiques",
      color: "#4f46e5",
      description: "Calcul, géométrie, problèmes",
    },
    {
      id: "2",
      name: "Français",
      color: "#dc2626",
      description: "Lecture, écriture, grammaire",
    },
    {
      id: "3",
      name: "Sciences",
      color: "#059669",
      description: "Découverte du monde, expériences",
    },
    {
      id: "4",
      name: "Histoire",
      color: "#d97706",
      description: "Histoire de France et du monde",
    },
    {
      id: "5",
      name: "Géographie",
      color: "#7c3aed",
      description: "Cartes, régions, pays",
    },
    {
      id: "6",
      name: "Anglais",
      color: "#0891b2",
      description: "Langue vivante étrangère",
    },
    {
      id: "7",
      name: "Arts plastiques",
      color: "#be185d",
      description: "Dessin, peinture, créativité",
    },
    {
      id: "8",
      name: "Musique",
      color: "#65a30d",
      description: "Chant, instruments, écoute",
    },
    {
      id: "9",
      name: "EPS",
      color: "#ea580c",
      description: "Sport et activités physiques",
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    color: PREDEFINED_COLORS[0],
    description: "",
  });

  const handleOpenDialog = (subject?: Subject) => {
    if (subject) {
      setEditingSubject(subject);
      setFormData({
        name: subject.name,
        color: subject.color,
        description: subject.description || "",
      });
    } else {
      setEditingSubject(null);
      setFormData({
        name: "",
        color: PREDEFINED_COLORS[0],
        description: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveSubject = () => {
    if (!formData.name.trim()) return;

    if (editingSubject) {
      // Update existing subject
      setSubjects((prev) =>
        prev.map((subject) =>
          subject.id === editingSubject.id
            ? { ...subject, ...formData }
            : subject,
        ),
      );
    } else {
      // Create new subject
      const newSubject: Subject = {
        id: Date.now().toString(),
        ...formData,
      };
      setSubjects((prev) => [...prev, newSubject]);
    }

    setIsDialogOpen(false);
    setEditingSubject(null);
    setFormData({ name: "", color: PREDEFINED_COLORS[0], description: "" });
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((subject) => subject.id !== id));
  };

  return (
    <div className="container mx-auto py-8 bg-background min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Gestion des Matières</h1>
            <p className="text-muted-foreground">
              Créez et gérez les matières enseignées dans votre établissement
            </p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => handleOpenDialog()}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nouvelle matière
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingSubject
                  ? "Modifier la matière"
                  : "Créer une nouvelle matière"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom de la matière</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Ex: Mathématiques"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description (optionnelle)</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Ex: Calcul, géométrie, problèmes"
                />
              </div>
              <div className="grid gap-2">
                <Label>Couleur</Label>
                <div className="flex flex-wrap gap-2">
                  {PREDEFINED_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        formData.color === color
                          ? "border-gray-900 scale-110"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, color }))
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button
                onClick={handleSaveSubject}
                disabled={!formData.name.trim()}
              >
                {editingSubject ? "Modifier" : "Créer"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Liste des matières ({subjects.length})</span>
            <Badge variant="outline">
              {subjects.length} matière{subjects.length > 1 ? "s" : ""}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {subjects.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucune matière</h3>
              <p className="text-muted-foreground mb-4">
                Commencez par créer votre première matière
              </p>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Créer une matière
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matière</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Couleur</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell className="font-medium">
                      {subject.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {subject.description || "Aucune description"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: subject.color }}
                        />
                        <span className="text-sm text-muted-foreground">
                          {subject.color}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(subject)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Supprimer la matière
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer la matière
                                &quot;{subject.name}&quot; ? Cette action est
                                irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteSubject(subject.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
