import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigator } from "@/utils/navigator";

export function Alert() {
  const { navigateTo } = useNavigator();
  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Emai tidak terdeteksi!</AlertDialogTitle>
          <AlertDialogDescription>
            Kamu tidak bisa verif email kamu karena email kamu tidak ada. Atau
            kamu inject userId orang di path yaaaaa ??? 🤨
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => navigateTo("/auth/register")}>
            Buat akun.
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
