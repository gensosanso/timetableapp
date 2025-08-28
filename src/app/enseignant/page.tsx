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
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Users, BookOpen } from "lucide-react";
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
}

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  subjects: string[]; // Array of subject IDs
}

const MOCK_SUBJECTS: Subject[] = [
  { id: "1", name: "Mathématiques", color: "#4f46e5" },
  { id: "2", name: "Français", color: "#dc2626" },
  { id: "3", name: "Sciences", color: "#059669" },
  { id: "4", name: "Histoire", color: "#d97706" },
  { id: "5", name: "Géographie", color: "#7c3aed" },
  { id: "6", name: "Anglais", color: "#0891b2" },
  { id: "7", name: "Arts plastiques", color: "#be185d" },
  { id: "8", name: "Musique", color: "#65a30d" },
  { id: "9", name: "EPS", color: "#ea580c" },
];

export default function EnseignantPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: "1",
      firstName: "Marie",
      lastName: "Dupont",
      email: "marie.dupont@ecole.fr",
      subjects: ["1", "3"], // Mathématiques, Sciences
    },
    {
      id: "2",
      firstName: "Jean",
      lastName: "Martin",
      email: "jean.martin@ecole.fr",
      subjects: ["2", "4"], // Français, Histoire
    },
    {
      id: "3",
      firstName: "Sophie",
      lastName: "Bernard",
      email: "sophie.bernard@ecole.fr",
      subjects: ["6"], // Anglais
    },
    {
      id: "4",
      firstName: "Pierre",
      lastName: "Rousseau",
      email: "pierre.rousseau@ecole.fr",
      subjects: ["7", "8"], // Arts plastiques, Musique
    },
    {
      id: "5",
      firstName: "Claire",
      lastName: "Leroy",
      email: "claire.leroy@ecole.fr",
      subjects: ["9"], // EPS
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subjects: [] as string[],
  });

  const handleOpenDialog = (teacher?: Teacher) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setFormData({
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        email: teacher.email || "",
        subjects: [...teacher.subjects],
      });
    } else {
      setEditingTeacher(null);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subjects: [],
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveTeacher = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) return;

    if (editingTeacher) {
      // Update existing teacher
      setTeachers((prev) =>
        prev.map((teacher) =>
          teacher.id === editingTeacher.id
            ? { ...teacher, ...formData }
            : teacher,
        ),
      );
    } else {
      // Create new teacher
      const newTeacher: Teacher = {
        id: Date.now().toString(),
        ...formData,
      };
      setTeachers((prev) => [...prev, newTeacher]);
    }

    setIsDialogOpen(false);
    setEditingTeacher(null);
    setFormData({ firstName: "", lastName: "", email: "", subjects: [] });
  };

  const handleDeleteTeacher = (id: string) => {
    setTeachers((prev) => prev.filter((teacher) => teacher.id !== id));
  };

  const handleSubjectToggle = (subjectId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      subjects: checked
        ? [...prev.subjects, subjectId]
        : prev.subjects.filter((id) => id !== subjectId),
    }));
  };

  const getSubjectsByIds = (subjectIds: string[]) => {
    return MOCK_SUBJECTS.filter((subject) => subjectIds.includes(subject.id));
  };

  return (
    <div className="container mx-auto py-8 bg-background min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Gestion des Enseignants</h1>
            <p className="text-muted-foreground">
              Gérez les enseignants et leurs matières assignées
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
              Nouvel enseignant
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingTeacher
                  ? "Modifier l'enseignant"
                  : "Créer un nouvel enseignant"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    placeholder="Ex: Marie"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    placeholder="Ex: Dupont"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email (optionnel)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="Ex: marie.dupont@ecole.fr"
                />
              </div>
              <div className="grid gap-2">
                <Label>Matières enseignées</Label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-md p-3">
                  {MOCK_SUBJECTS.map((subject) => (
                    <div
                      key={subject.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={subject.id}
                        checked={formData.subjects.includes(subject.id)}
                        onCheckedChange={(checked) =>
                          handleSubjectToggle(subject.id, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={subject.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: subject.color }}
                        />
                        {subject.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button
                onClick={handleSaveTeacher}
                disabled={
                  !formData.firstName.trim() || !formData.lastName.trim()
                }
              >
                {editingTeacher ? "Modifier" : "Créer"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Liste des enseignants ({teachers.length})</span>
            <Badge variant="outline">
              {teachers.length} enseignant{teachers.length > 1 ? "s" : ""}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {teachers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun enseignant</h3>
              <p className="text-muted-foreground mb-4">
                Commencez par ajouter votre premier enseignant
              </p>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un enseignant
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom complet</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Matières enseignées</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher) => {
                  const teacherSubjects = getSubjectsByIds(teacher.subjects);
                  return (
                    <TableRow key={teacher.id}>
                      <TableCell className="font-medium">
                        {teacher.firstName} {teacher.lastName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {teacher.email || "Aucun email"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {teacherSubjects.length === 0 ? (
                            <Badge
                              variant="outline"
                              className="text-muted-foreground"
                            >
                              Aucune matière
                            </Badge>
                          ) : (
                            teacherSubjects.map((subject) => (
                              <Badge
                                key={subject.id}
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: subject.color }}
                                />
                                {subject.name}
                              </Badge>
                            ))
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDialog(teacher)}
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
                                  Supprimer l'enseignant
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer
                                  l'enseignant &quot;{teacher.firstName}{" "}
                                  {teacher.lastName}&quot; ? Cette action est
                                  irréversible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteTeacher(teacher.id)
                                  }
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
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
