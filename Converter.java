import java.util.Scanner;
import java.io.File;
import java.io.PrintWriter;

public class Converter {

private static final Scanner STDIN = new Scanner(System.in);
 private static Scanner fileScan;
 private static String srcFilePath;
 private static String destFilePath;
 private static String varName;

public static void main(String[] args) {

try
{
	System.out.println("Input file path below:");
	srcFilePath = STDIN.nextLine();
	
	System.out.println("\nAwesome! Let me try and open the file in "+ "the file path:\n" + srcFilePath + "\n");
	File fileName = new File(srcFilePath);
	fileScan = new Scanner (fileName);
	System.out.println("Everything working beautifully thus far!\n" + "Which name do you choose for this " + "model data string var?\n" + "Please write a single word using JS convention. ^^");
	varName = STDIN.next();
	STDIN.nextLine();
	if(!varName.matches("[a-zA-Z0-9]*"))
	{
 	fileScan.close();
	throw new Exception();
	}
	System.out.println("\nAnd where do we write the results to? " + "Give me a file path. ^^\n" + "Please use a .js file as I can " + "only use those files. Or just press enter to quit. ;)");
	destFilePath = STDIN.nextLine();
	if(destFilePath != "") {
		if(!destFilePath.contains(".j")) {
		 throw new Exception(); }
		 }
	if(destFilePath != "")
 {
 File f = new File(destFilePath);
 if(f.exists() && !f.isDirectory()) {

System.out.println("\nOh noo!! The file you "
 + "specified already exists!\n"
 + "Do you want to overwrite it? Y/N");
 if(STDIN.next().matches("[yY]*"))
 {
 System.out.println("\nOK! I am overwritting it . . .\n");

writeToFile();

}

}
 else
 {
 writeToFile();
 }

System.out.println("\nTATATAAAA . . . All Done ! ! ^^\n"
 + "The javascript string var version of the Blender "
 + "obj file is ready!\n"
 + "Note that new line characters were "
 + "substituted by '\\n'\n"
 + "The code was saved to "
 + destFilePath);
 }

fileScan.close();

 

} catch (Exception e)
 {

System.out.println("\n###\noops... something went wrong\n###");

}

}

private static void writeToFile() throws Exception
 {

PrintWriter pw = new PrintWriter(destFilePath);

pw.print("var " + varName + " = \"");
 while(fileScan.hasNextLine())
 {
 pw.print(fileScan.nextLine() + "\\n");

}
 pw.print("\";");

pw.close();

}

}

 

/////////////////////////////////////////////////////////////////////////////////////////

