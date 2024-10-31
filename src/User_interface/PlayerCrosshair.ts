
export const createPlayerCrosshair = (containerId: string) : HTMLElement=> {
    const crosshair = document.createElement('div');
    crosshair.id = containerId;

    crosshair.style.position = 'absolute';
    crosshair.style.top = '50%';
    crosshair.style.left = '50%';
    crosshair.style.transform = 'translate(-50%, -50%)';
    crosshair.style.width = '20px';
    crosshair.style.height = '20px';
    crosshair.style.border = '2px solid white';
    crosshair.style.borderRadius = '50%';
    
    document.body.appendChild(crosshair);    
    return crosshair;
}