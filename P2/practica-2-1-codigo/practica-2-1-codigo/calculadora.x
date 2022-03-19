
typedef double* row;
typedef row* matriz;

struct matrix{
    int fil;
    int col;
    matriz m;
};

program CALCULADORA{
    version CALCULADORAVER{
        double suma(double, double)=1;
        double resta(double, double)=2;
        double mult(double, double)=3;
        double division(double, double)=4;
        int modulo(int, int)=5;
        double raizCuadrada(double)=6;
        double logaritmo(int, int)=7;
        int esPrimo(int)=8;
        int potencia(int, int)=9;
        int factorial(int)=10;
        matrix sumaMatricial(matrix, matrix)=11;
        matrix multMatricial(matrix, matrix)=12;
        matrix traspuesta(matrix)=13;
        double determinanteMatriz(matrix)=14;
        matrix resolverSistemas(matrix)=15;
        double multiplesComandos(string)=16;
    } =1;
} = 0x20000001;