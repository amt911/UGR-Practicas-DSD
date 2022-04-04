typedef double m<>;

struct matrix{
    int fil;
    int col;
    m m;
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
        matrix restaMatricial(matrix, matrix)=12;
        matrix multMatricial(matrix, matrix)=13;
        matrix traspuesta(matrix)=14;
        string resolverEcuaciones(string, double, double, double)=15;
        double multiplesComandos(string)=16;
    } =1;
} = 0x20000001;