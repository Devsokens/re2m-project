import { Member } from '../types/member';

/**
 * Generates a vCard 4.0 standard formatted string for a given Member
 */
export function generateVCardString(member: Member): string {
  const fullName = `${member.firstName} ${member.lastName}`;
  const formattedName = `${member.lastName};${member.firstName};;;`;
  
  const vcardLines = [
    'BEGIN:VCARD',
    'VERSION:4.0',
    `N:${formattedName}`,
    `FN:${member.civility ? member.civility + ' ' : ''}${fullName}`,
    'ORG:Cabinet RE2M',
    `TITLE:${member.title}`,
    `ROLE:${member.department}`,
    `TEL;TYPE=cell,voice:${member.mobile}`,
    member.phone ? `TEL;TYPE=work,voice:${member.phone}` : '',
    `EMAIL;TYPE=work:${member.email}`,
    `ADR;TYPE=work:;;${member.address};;;;`,
    member.website ? `URL;TYPE=work:${member.website}` : '',
    member.linkedin ? `URL;TYPE=linkedin:${member.linkedin}` : '',
    member.bio ? `NOTE:${member.bio.replace(/\n/g, ' ')}` : '',
    `REV:${new Date().toISOString()}`,
    'END:VCARD'
  ].filter(line => line.trim().length > 0);

  return vcardLines.join('\r\n');
}

/**
 * Triggers a browser file download of the member's vCard (.vcf)
 */
export function downloadVCard(member: Member): void {
  const vcardText = generateVCardString(member);
  const blob = new Blob([vcardText], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  const fileName = `vcard_${member.firstName.toLowerCase()}_${member.lastName.toLowerCase()}.vcf`;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
